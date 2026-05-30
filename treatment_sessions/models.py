import uuid
from django.conf import settings
from django.db import models


class PatientSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='treatment_sessions')
    appointment = models.OneToOneField(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='session_record'
    )
    physiotherapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='conducted_sessions'
    )
    session_date = models.DateField()
    duration_minutes = models.PositiveIntegerField(default=60)
    treatment_type = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    progress_evaluation = models.TextField(blank=True)
    pain_level_before = models.PositiveIntegerField(null=True, blank=True, help_text='0-10 scale')
    pain_level_after = models.PositiveIntegerField(null=True, blank=True, help_text='0-10 scale')
    exercises_performed = models.ManyToManyField('exercises.Exercise', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-session_date']

    def __str__(self):
        return f"{self.patient} - Session on {self.session_date}"
