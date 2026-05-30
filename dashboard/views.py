from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from patients.models import Patient
from appointments.models import Appointment
from treatment_sessions.models import PatientSession
from reports.models import Invoice


class DashboardOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        today = timezone.now().date()
        first_of_month = today.replace(day=1)
        first_of_year = today.replace(month=1, day=1)
        patients = Patient.objects.all()
        if user.is_physiotherapist:
            patients = patients.filter(physiotherapist=user)
        appointments = Appointment.objects.all()
        if user.is_physiotherapist:
            appointments = appointments.filter(physiotherapist=user)
        today_appointments = appointments.filter(date=today)
        upcoming_appointments = appointments.filter(date__gte=today, status__in=['scheduled', 'confirmed']).order_by('date', 'start_time')[:10]
        invoices = Invoice.objects.all()
        monthly_revenue = invoices.filter(issue_date__gte=first_of_month, status='paid').aggregate(s=Sum('total_amount'))['s'] or 0
        yearly_revenue = invoices.filter(issue_date__gte=first_of_year, status='paid').aggregate(s=Sum('total_amount'))['s'] or 0
        sessions = PatientSession.objects.all()
        if user.is_physiotherapist:
            sessions = sessions.filter(physiotherapist=user)
        completed_sessions = sessions.count()
        pathology_data = list(patients.filter(is_active=True).values('pathology').annotate(count=Count('id')).order_by('-count')[:8])
        patient_growth = []
        for i in range(5, -1, -1):
            month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            count = patients.filter(created_at__date__gte=month_start, created_at__date__lt=month_end).count()
            patient_growth.append({'month': month_start.strftime('%b'), 'count': count})
        revenue_by_month = []
        for i in range(5, -1, -1):
            month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            revenue = invoices.filter(issue_date__gte=month_start, issue_date__lt=month_end, status='paid').aggregate(s=Sum('total_amount'))['s'] or 0
            revenue_by_month.append({'month': month_start.strftime('%b'), 'revenue': float(revenue)})
        apt_stats = dict(today_appointments.values('status').annotate(count=Count('id')).values_list('status', 'count'))
        return Response({
            'kpi': {
                'total_patients': patients.filter(is_active=True).count(),
                'total_patients_all': patients.count(),
                'today_appointments': today_appointments.count(),
                'active_patients': patients.filter(is_active=True).count(),
                'monthly_revenue': float(monthly_revenue),
                'yearly_revenue': float(yearly_revenue),
                'completed_sessions': completed_sessions,
                'outstanding_balance': float(patients.aggregate(s=Sum('remaining_balance'))['s'] or 0),
            },
            'charts': {
                'patient_growth': patient_growth,
                'revenue_by_month': revenue_by_month,
                'pathology_distribution': pathology_data,
                'appointment_stats': apt_stats,
            },
            'widgets': {
                'upcoming_appointments': [{'id': str(a.id), 'patient': a.patient.full_name, 'date': str(a.date), 'start_time': str(a.start_time), 'status': a.status, 'treatment_type': a.treatment_type} for a in upcoming_appointments],
                'recent_patients': [{'id': str(p.id), 'name': p.full_name, 'pathology': p.pathology, 'created_at': p.created_at.isoformat()} for p in patients.order_by('-created_at')[:5]],
            }
        })
