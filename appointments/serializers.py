from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    patient_phone = serializers.CharField(source='patient.phone', read_only=True)
    physiotherapist_name = serializers.CharField(source='physiotherapist.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'patient', 'physiotherapist', 'date', 'start_time', 'end_time',
            'treatment_type', 'notes'
        ]

    def validate(self, data):
        from django.db.models import Q
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError('End time must be after start time')
        conflicts = Appointment.objects.filter(
            physiotherapist=data['physiotherapist'],
            date=data['date'],
            status__in=['scheduled', 'confirmed', 'in_progress']
        ).filter(Q(start_time__lt=data['end_time']) & Q(end_time__gt=data['start_time']))
        if self.instance:
            conflicts = conflicts.exclude(pk=self.instance.pk)
        if conflicts.exists():
            raise serializers.ValidationError('Time conflict: the physiotherapist has another appointment at this slot')
        return data


class CalendarEventSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    start = serializers.SerializerMethodField()
    end = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['id', 'title', 'start', 'end', 'color', 'status']

    def get_title(self, obj):
        return f"{obj.patient.full_name} - {obj.treatment_type or 'Session'}"

    def get_start(self, obj):
        return f"{obj.date}T{obj.start_time}"

    def get_end(self, obj):
        return f"{obj.date}T{obj.end_time}"

    def get_color(self, obj):
        colors = {
            'scheduled': '#3B82F6', 'confirmed': '#10B981', 'in_progress': '#F59E0B',
            'completed': '#6366F1', 'cancelled': '#EF4444', 'no_show': '#6B7280',
        }
        return colors.get(obj.status, '#3B82F6')
