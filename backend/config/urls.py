"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from accounts.views import CurrentUserView
from django.contrib import admin
from django.urls import path
from medicines.views import AdminOverviewView, AnalyticsSummaryView, ChatView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/me/", CurrentUserView.as_view()),
    path("api/chat/", ChatView.as_view(), name="medicine-chat"),
    path("api/analytics/summary/", AnalyticsSummaryView.as_view(), name="analytics-summary"),
    path("api/admin/overview/", AdminOverviewView.as_view(), name="admin-overview"),
]