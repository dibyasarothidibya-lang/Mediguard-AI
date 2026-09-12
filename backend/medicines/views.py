from typing import Any, cast

from accounts.authentication import FirebaseAuthentication
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

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

        return Response({"answer": answer})