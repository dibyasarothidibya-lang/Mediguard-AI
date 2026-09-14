from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from accounts.models import UserProfile
from medicines.models import ChatInteraction

User = get_user_model()

@override_settings(ADMIN_FIREBASE_UIDS=["uid-admin-1", "uid-admin-2"])
class AdminOverviewSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Admin user with authorized Firebase UID
        self.admin_user = User.objects.create_user(
            username="admin_user",
            email="admin@example.com",
        )
        UserProfile.objects.create(
            user=self.admin_user,
            firebase_uid="uid-admin-1",
            email="admin@example.com",
            display_name="Admin User",
        )

        # Non-admin user with unauthorized Firebase UID
        self.regular_user = User.objects.create_user(
            username="regular_user",
            email="regular@example.com",
        )
        UserProfile.objects.create(
            user=self.regular_user,
            firebase_uid="uid-reg-2",
            email="regular@example.com",
            display_name="Regular Student",
        )

    def test_anonymous_request_rejected_401(self):
        response = self.client.get("/api/admin/overview/")
        self.assertEqual(response.status_code, 401)

    @patch("accounts.authentication.firebase_auth.verify_id_token")
    def test_regular_authenticated_user_rejected_403(self, mock_verify):
        mock_verify.return_value = {
            "uid": "uid-reg-2",
            "email": "regular@example.com",
        }
        response = self.client.get(
            "/api/admin/overview/",
            HTTP_AUTHORIZATION="Bearer regular-token",
        )
        self.assertEqual(response.status_code, 403)
        self.assertIn("Administrator privileges required", response.data.get("detail", ""))

    @patch("accounts.authentication.firebase_auth.verify_id_token")
    def test_matching_email_with_unauthorized_uid_rejected_403(self, mock_verify):
        """Attacker registering with matching email address is denied because UID is unauthorized."""
        mock_verify.return_value = {
            "uid": "attacker-unauthorized-uid",
            "email": "admin@example.com",
        }
        response = self.client.get(
            "/api/admin/overview/",
            HTTP_AUTHORIZATION="Bearer attacker-token",
        )
        self.assertEqual(response.status_code, 403)
        self.assertIn("Administrator privileges required", response.data.get("detail", ""))

    @patch("accounts.authentication.firebase_auth.verify_id_token")
    def test_admin_user_with_authorized_uid_allowed_200(self, mock_verify):
        mock_verify.return_value = {
            "uid": "uid-admin-1",
            "email": "admin@example.com",
        }
        response = self.client.get(
            "/api/admin/overview/",
            HTTP_AUTHORIZATION="Bearer admin-token",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("stats", response.data)
        self.assertIn("users", response.data)
        self.assertIn("queries", response.data)
        self.assertGreaterEqual(response.data["stats"]["total_registered_users"], 2)

    def test_public_analytics_summary_exposes_only_aggregates(self):
        """Public analytics must expose only aggregate counts and never question text/recent activity."""
        ChatInteraction.objects.create(
            user=self.regular_user,
            question="Confidential patient medicine question about dosage",
            answer_snippet="Safe dosage explanation",
        )
        response = self.client.get("/api/analytics/summary/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_registered_users", response.data)
        self.assertIn("active_users", response.data)
        self.assertIn("total_queries", response.data)
        # Ensure no activity log or question previews exist in public summary
        self.assertNotIn("recent_activity", response.data)
        self.assertNotIn("Confidential patient medicine question", str(response.data))
