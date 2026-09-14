from django.conf import settings
from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    firebase_uid = models.CharField(max_length=128, unique=True)
    email = models.EmailField(blank=True, default="")
    display_name = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(default=timezone.now)
    last_active_at = models.DateTimeField(default=timezone.now)
    query_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.email or self.display_name or self.firebase_uid
