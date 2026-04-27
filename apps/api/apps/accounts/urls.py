from django.urls import path
from .views import LoginView, RefreshView, register, ProfileView, DonationsView, AdminUserView

urlpatterns = [
    path("auth/register", register, name="register"),
    path("auth/login", LoginView.as_view(), name="login"),
    path("auth/refresh", RefreshView.as_view(), name="refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/donations/", DonationsView.as_view(), name="profile-donations"),
    path("admin/users/", AdminUserView.as_view(), name="admin-users"),
]
