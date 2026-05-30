from django.urls import path
from . import views

urlpatterns = [
    path("", views.AppointmentListCreateView.as_view(), name="appointment-list-create"),
    path("<uuid:pk>/", views.AppointmentDetailView.as_view(), name="appointment-detail"),
    path("today/", views.TodayAppointmentsView.as_view(), name="today-appointments"),
    path("upcoming/", views.UpcomingAppointmentsView.as_view(), name="upcoming-appointments"),
    path("calendar/events/", views.CalendarEventsView.as_view(), name="calendar-events"),
]
