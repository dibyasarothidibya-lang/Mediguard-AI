from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from accounts.models import UserProfile
from medicines.models import ChatInteraction

User = get_user_model()

@override_settings(ADMIN_EMAILS=["dibyasarothidibya@gmail.com", "dibyasarothidiibya@gmail.com"])
class AdminOverviewSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Admin user
        self.admin_user = User.objects.create_user(
            username="admin_user",
            email="dibyasarothidibya@gmail.com",
        )
        UserProfile.objects.create(
            user=self.admin_user,
            firebase_uid="uid-admin-1",
            email="dibyasarothidibya@gmail.com",
            display_name="Dibyasarothi",
        )

        # Non-admin user
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
    def test_admin_user_allowed_200(self, mock_verify):
        mock_verify.return_value = {
            "uid": "uid-admin-1",
            "email": "dibyasarothidibya@gmail.com",
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
