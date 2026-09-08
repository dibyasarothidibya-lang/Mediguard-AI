from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import FirebaseAuthentication


class CurrentUserView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.pk,
            "username": request.user.username,
            "firebase_uid": request.auth["uid"],
        })
