from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "display_name",
        "query_count",
        "created_at",
        "last_active_at",
        "firebase_uid",
    )
    search_fields = ("email", "display_name", "firebase_uid", "user__username")
    list_filter = ("created_at", "last_active_at")
    readonly_fields = ("created_at", "last_active_at")
    ordering = ("-created_at",)
