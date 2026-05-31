from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'pathology', 'total_sessions', 'remaining_balance', 'is_active']
    list_filter = ['is_active', 'gender', 'pathology']
    search_fields = ['first_name', 'last_name', 'phone', 'email']
