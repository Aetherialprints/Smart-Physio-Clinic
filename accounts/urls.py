from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path("change-password/", views.ChangePasswordView.as_view(), name="change-password"),
    path("users/", views.UserListView.as_view(), name="user-list"),
]
