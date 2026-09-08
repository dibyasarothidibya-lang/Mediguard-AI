from unittest.mock import patch

from django.test import RequestFactory, SimpleTestCase
from firebase_admin import auth as firebase_auth
from firebase_admin.exceptions import UnavailableError
from rest_framework.exceptions import AuthenticationFailed

from .authentication import (
    AuthenticationServiceUnavailable,
    get_verified_firebase_claims,
)
from .token_utils import extract_bearer_token


class BearerTokenTests(SimpleTestCase):
    def test_extracts_token(self):
        request = RequestFactory().get(
            "/",
            headers={"Authorization": "Bearer example-token"},
        )

        token = extract_bearer_token(request)

        self.assertEqual(token, "example-token")

    def test_rejects_missing_token(self):
        request = RequestFactory().get(
            "/",
            headers={"Authorization": "Bearer"},
        )

        with self.assertRaises(AuthenticationFailed):
            extract_bearer_token(request)





class FirebaseVerificationTests(SimpleTestCase):
    def setUp(self):
        self.request = RequestFactory().get(
            "/",
            headers={"Authorization": "Bearer example-token"},
        )

    def test_returns_verified_claims(self):
        claims = {"uid": "firebase-user-123"}

        with patch(
            "accounts.authentication.firebase_auth.verify_id_token",
            return_value=claims,
        ) as verify:
            result = get_verified_firebase_claims(self.request)

        self.assertEqual(result, claims)
        verify.assert_called_once_with(
            "example-token",
            check_revoked=True,
        )

    def test_rejects_invalid_token(self):
        with patch(
            "accounts.authentication.firebase_auth.verify_id_token",
            side_effect=firebase_auth.InvalidIdTokenError("Invalid token"),
        ), self.assertRaises(AuthenticationFailed):
            get_verified_firebase_claims(self.request)

    def test_reports_firebase_unavailable(self):
        with patch(
            "accounts.authentication.firebase_auth.verify_id_token",
            side_effect=UnavailableError("Firebase is unavailable"),
        ), self.assertRaises(AuthenticationServiceUnavailable) as caught:
            get_verified_firebase_claims(self.request)

        self.assertEqual(caught.exception.status_code, 503)