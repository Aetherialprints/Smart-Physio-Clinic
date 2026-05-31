from django.contrib import admin
from .models import PatientSession

@admin.register(PatientSession)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'physiotherapist', 'session_date', 'duration_minutes', 'pain_level_before', 'pain_level_after']
    list_filter = ['session_date']
    search_fields = ['patient__first_name', 'patient__last_name']
