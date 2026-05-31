from rest_framework import serializers
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import PatientSession


class SessionSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    physiotherapist_name = serializers.CharField(source='physiotherapist.full_name', read_only=True)

    class Meta:
        model = PatientSession
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_pain_level_before(self, value):
        if value is not None and (value < 0 or value > 10):
            raise serializers.ValidationError('Pain level must be between 0 and 10')
        return value

    def validate_pain_level_after(self, value):
        if value is not None and (value < 0 or value > 10):
            raise serializers.ValidationError('Pain level must be between 0 and 10')
        return value


class SessionListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = PatientSession
        fields = [
            'id', 'patient_name', 'session_date', 'duration_minutes',
            'treatment_type', 'pain_level_before', 'pain_level_after', 'created_at'
        ]
