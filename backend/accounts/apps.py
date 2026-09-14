import firebase_admin
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = "accounts"

    def ready(self):
        try:
            firebase_admin.get_app()
        except ValueError:
            firebase_admin.initialize_app()
