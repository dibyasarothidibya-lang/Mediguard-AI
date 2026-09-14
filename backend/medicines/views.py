from typing import Any, cast

from accounts.authentication import FirebaseAuthentication
from accounts.models import UserProfile
from django.conf import settings
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from .models import ChatInteraction
from .serializers import ChatRequestSerializer
from .services.gemini_service import ask_gemini


class ChatMinuteThrottle(UserRateThrottle):
    scope = "chat_minute"
    rate = "5/min"


class ChatHourThrottle(UserRateThrottle):
    scope = "chat_hour"
    rate = "30/hour"


class ChatView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]
    throttle_classes = [ChatMinuteThrottle, ChatHourThrottle]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = cast(dict[str, Any], serializer.validated_data)
        question = data["question"]
        history = data["history"]

        try:
            answer = ask_gemini(question, history=history)
        except RuntimeError:
            return Response(
                {
                    "detail": (
                        "The medicine assistant is temporarily unavailable. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Record interaction in audit log
        try:
            forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            client_ip = forwarded_for.split(",")[0].strip() if forwarded_for else request.META.get("REMOTE_ADDR")

            ChatInteraction.objects.create(
                user=request.user,
                question=question,
                answer_snippet=answer[:500] if answer else "",
                client_ip=client_ip,
            )

            # Increment user query count
            profile = getattr(request.user, "profile", None)
            if profile:
                profile.query_count += 1
                profile.save(update_fields=["query_count", "last_active_at"])
        except Exception:
            # Audit logging failure should not crash the user's chat response
            pass

        return Response({"answer": answer})


class AnalyticsSummaryView(APIView):
    """Provides platform engagement telemetry for evaluation and admin review."""

    def get(self, request):
        total_registered_users = UserProfile.objects.count()
        active_users = UserProfile.objects.filter(query_count__gt=0).count()
        total_queries = ChatInteraction.objects.count()

        return Response({
            "total_registered_users": total_registered_users,
            "active_users": active_users,
            "total_queries": total_queries,
        })


class AdminOverviewView(APIView):
    """Exclusive administration analytics dashboard payload for university project review."""
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, "profile", None)

        claims = request.auth if isinstance(request.auth, dict) else {}
        token_uid = (claims.get("uid") or "").strip()
        profile_uid = (profile.firebase_uid or "").strip() if profile else ""

        admin_uids = getattr(settings, "ADMIN_FIREBASE_UIDS", [])

        is_authorized = (
            user.is_superuser
            or user.is_staff
            or (bool(token_uid) and token_uid in admin_uids)
            or (bool(profile_uid) and profile_uid in admin_uids)
        )

        if not is_authorized:
            return Response(
                {"detail": "Access denied. Administrator privileges required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        total_registered_users = UserProfile.objects.count()
        active_users = UserProfile.objects.filter(query_count__gt=0).count()
        total_queries = ChatInteraction.objects.count()

        users_qs = UserProfile.objects.select_related("user").order_by("-last_active_at")
        users_list = [
            {
                "id": p.user.id,
                "email": p.email or p.user.email or "No Email Provided",
                "display_name": p.display_name or (p.user.get_full_name() if p.user.get_full_name() else "Tester"),
                "firebase_uid": p.firebase_uid,
                "created_at": p.created_at.isoformat() if p.created_at else "",
                "last_active_at": p.last_active_at.isoformat() if p.last_active_at else "",
                "query_count": p.query_count,
            }
            for p in users_qs
        ]

        queries_qs = ChatInteraction.objects.select_related("user", "user__profile").order_by("-created_at")[:200]
        queries_list = []
        for q in queries_qs:
            profile = getattr(q.user, "profile", None)
            user_email = (profile.email if profile and profile.email else q.user.email) or q.user.username
            user_name = (profile.display_name if profile and profile.display_name else "") or "Tester"
            queries_list.append({
                "id": q.id,
                "user_email": user_email,
                "user_name": user_name,
                "question": q.question,
                "answer": q.answer_snippet,
                "created_at": q.created_at.isoformat() if q.created_at else "",
                "client_ip": q.client_ip or "127.0.0.1",
            })

        return Response({
            "stats": {
                "total_registered_users": total_registered_users,
                "active_users": active_users,
                "total_queries": total_queries,
            },
            "users": users_list,
            "queries": queries_list,
        })