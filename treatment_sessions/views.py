from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PatientSession
from .serializers import SessionSerializer, SessionListSerializer


class SessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SessionListSerializer
        return SessionSerializer

    def get_queryset(self):
        qs = PatientSession.objects.all()
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs.select_related('patient', 'physiotherapist')


class SessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PatientSession.objects.all()


class PatientSessionHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        sessions = PatientSession.objects.filter(patient_id=patient_id).select_related('patient')
        serializer = SessionListSerializer(sessions, many=True)
        return Response(serializer.data)
