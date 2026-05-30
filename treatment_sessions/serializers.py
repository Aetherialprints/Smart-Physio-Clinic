from rest_framework import serializers
from .models import PatientSession


class SessionSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    physiotherapist_name = serializers.CharField(source='physiotherapist.full_name', read_only=True)

    class Meta:
        model = PatientSession
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SessionListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = PatientSession
        fields = [
            'id', 'patient_name', 'session_date', 'duration_minutes',
            'treatment_type', 'pain_level_before', 'pain_level_after', 'created_at'
        ]
