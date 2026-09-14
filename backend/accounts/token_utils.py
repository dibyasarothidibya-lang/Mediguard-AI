from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed


def extract_bearer_token(request):
    parts = get_authorization_header(request).split()

    if not parts:
        return None

    if parts[0].lower() != b"bearer":
        return None


    if len(parts) != 2:
        raise AuthenticationFailed(
            "Use Bearer followed by one token."
        )

    try:
        return parts[1].decode("ascii")
    except UnicodeDecodeError:
        raise AuthenticationFailed(
            "The token contains invalid characters."
        )
