import uuid
from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError


class Appointment(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        CONFIRMED = 'confirmed', 'Confirmed'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        NO_SHOW = 'no_show', 'No Show'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='appointments')
    physiotherapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    scheduled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='scheduled_appointments'
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    treatment_type = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['date', 'start_time']),
            models.Index(fields=['status']),
            models.Index(fields=['patient', 'date']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.date} {self.start_time}"

    def clean(self):
        from django.db.models import Q
        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                raise ValidationError('End time must be after start time')
            conflicts = Appointment.objects.filter(
                physiotherapist=self.physiotherapist,
                date=self.date,
                status__in=['scheduled', 'confirmed', 'in_progress']
            ).exclude(pk=self.pk).filter(
                Q(start_time__lt=self.end_time) & Q(end_time__gt=self.start_time)
            )
            if conflicts.exists():
                raise ValidationError(
                    f'Time conflict: {self.physiotherapist} has another appointment at this slot'
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
