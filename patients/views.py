from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Patient
from .serializers import PatientSerializer, PatientListSerializer, PatientStatisticsSerializer


class IsPhysioOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_physiotherapist or request.user.is_admin
        )


class PatientListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'phone', 'email', 'pathology']
    ordering_fields = ['created_at', 'first_name', 'last_name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PatientListSerializer
        return PatientSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Patient.objects.all()
        if user.is_physiotherapist:
            qs = qs.filter(physiotherapist=user)
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        pathology = self.request.query_params.get('pathology')
        if pathology:
            qs = qs.filter(pathology__icontains=pathology)
        return qs.select_related('physiotherapist')


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Patient.objects.all()

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class PatientStatisticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        qs = Patient.objects.all()
        if user.is_physiotherapist:
            qs = qs.filter(physiotherapist=user)
        now = timezone.now()
        first_of_month = now.replace(day=1, hour=0, minute=0, second=0)
        data = {
            'total_patients': qs.count(),
            'active_patients': qs.filter(is_active=True).count(),
            'new_this_month': qs.filter(created_at__gte=first_of_month).count(),
            'by_gender': dict(qs.values('gender').annotate(count=Count('id')).values_list('gender', 'count')),
            'by_pathology': dict(qs.values('pathology').annotate(count=Count('id')).order_by('-count')[:10].values_list('pathology', 'count')),
            'total_revenue': qs.aggregate(s=Sum('amount_paid'))['s'] or 0,
            'total_outstanding': qs.aggregate(s=Sum('remaining_balance'))['s'] or 0,
        }
        return Response(data)
