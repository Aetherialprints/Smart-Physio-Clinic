from django.urls import path
from . import views

urlpatterns = [
    path("", views.SessionListCreateView.as_view(), name="session-list-create"),
    path("<uuid:pk>/", views.SessionDetailView.as_view(), name="session-detail"),
    path("patient/<uuid:patient_id>/", views.PatientSessionHistoryView.as_view(), name="patient-session-history"),
]
