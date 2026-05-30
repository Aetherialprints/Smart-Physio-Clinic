from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateSerializer, CalendarEventSerializer


class AppointmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient__first_name', 'patient__last_name']
    ordering_fields = ['date', 'start_time', 'status']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AppointmentSerializer
        return AppointmentCreateSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.all()
        if user.is_physiotherapist:
            qs = qs.filter(physiotherapist=user)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date=date)
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            qs = qs.filter(date__range=[start_date, end_date])
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs.select_related('patient', 'physiotherapist')


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Appointment.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AppointmentCreateSerializer
        return AppointmentSerializer


class TodayAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        today = timezone.now().date()
        user = request.user
        qs = Appointment.objects.filter(date=today)
        if user.is_physiotherapist:
            qs = qs.filter(physiotherapist=user)
        return Response(AppointmentSerializer(qs, many=True).data)


class CalendarEventsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        qs = Appointment.objects.all()
        if user.is_physiotherapist:
            qs = qs.filter(physiotherapist=user)
        if start and end:
            qs = qs.filter(date__range=[start, end])
        return Response(CalendarEventSerializer(qs, many=True).data)


class UpcomingAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        today = timezone.now().date()
        next_week = today + timedelta(days=7)
        user = request.user
        qs = Appointment.objects.filter(date__gte=today, date__lte=next_week, status__in=['scheduled', 'confirmed'])
        if user.is_physiotherapist:
            qs = qs.filter(physiotherapist=user)
        return Response(AppointmentSerializer(qs.order_by('date', 'start_time'), many=True).data)
