from django.urls import path
from .views import LoginView, RefreshView, register

urlpatterns = [
    path("auth/register", register, name="register"),
    path("auth/login", LoginView.as_view(), name="login"),
    path("auth/refresh", RefreshView.as_view(), name="refresh"),
]
