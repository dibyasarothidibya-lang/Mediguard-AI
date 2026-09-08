from uuid import uuid4

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from firebase_admin import auth as firebase_auth
from firebase_admin.exceptions import FirebaseError
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import APIException, AuthenticationFailed

from .models import UserProfile
from .token_utils import extract_bearer_token


class AuthenticationServiceUnavailable(APIException):
    status_code = 503
    default_detail = "Authentication is temporarily unavailable. Try again."
    default_code = "authentication_unavailable"


def get_verified_firebase_claims(request):
    token = extract_bearer_token(request)

    if token is None:
        return None

    try:
        return firebase_auth.verify_id_token(
            token,
            check_revoked=True,
        )
    except (
        firebase_auth.InvalidIdTokenError,
        firebase_auth.UserDisabledError,
        firebase_auth.UserNotFoundError,
    ) as exc:
        raise AuthenticationFailed(
            "Authentication credentials were rejected."
        ) from exc
    except FirebaseError as exc:
        raise AuthenticationServiceUnavailable() from exc


def get_or_create_local_user(firebase_uid):
    profiles = UserProfile.objects.select_related("user")
    profile = profiles.filter(firebase_uid=firebase_uid).first()

    if profile is not None:
        return profile.user

    try:
        with transaction.atomic():
            user = get_user_model().objects.create_user(
                username=f"firebase_{uuid4().hex}",
                password=None,
            )

            UserProfile.objects.create(
                user=user,
                firebase_uid=firebase_uid,
            )

        return user

    except IntegrityError:
        profile = profiles.filter(firebase_uid=firebase_uid).first()

        if profile is None:
            raise

        return profile.user





class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        claims = get_verified_firebase_claims(request)

        if claims is None:
            return None

        uid = claims.get("uid")

        if not isinstance(uid, str) or not uid or len(uid) > 128:
            raise AuthenticationFailed("Verified token has no valid user ID.")

        user = get_or_create_local_user(uid)

        if not user.is_active:
            raise AuthenticationFailed("This account is disabled.")

        return user, claims

    def authenticate_header(self, request):
        return "Bearer"