from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    physiotherapist_name = serializers.CharField(source='physiotherapist.full_name', read_only=True)
    completed_sessions = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['id', 'total_amount', 'remaining_balance', 'created_at', 'updated_at']

    def get_completed_sessions(self, obj):
        return obj.treatment_sessions.count()


class PatientListSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    physiotherapist_name = serializers.CharField(source='physiotherapist.full_name', read_only=True)
    completed_sessions = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'age',
            'gender', 'phone', 'pathology', 'total_sessions',
            'completed_sessions', 'remaining_balance', 'is_active',
            'created_at', 'photo', 'physiotherapist_name'
        ]

    def get_completed_sessions(self, obj):
        return obj.treatment_sessions.count()


class PatientStatisticsSerializer(serializers.Serializer):
    total_patients = serializers.IntegerField()
    active_patients = serializers.IntegerField()
    new_this_month = serializers.IntegerField()
    by_gender = serializers.DictField()
    by_pathology = serializers.DictField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_outstanding = serializers.DecimalField(max_digits=12, decimal_places=2)
