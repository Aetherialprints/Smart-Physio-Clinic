import uuid
from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        APPOINTMENT = "appointment", "Appointment"
        REMINDER = "reminder", "Reminder"
        PAYMENT = "payment", "Payment"
        SYSTEM = "system", "System"
        MISSED = "missed", "Missed Appointment"

    class Channel(models.TextChoices):
        IN_APP = "in_app", "In-App"
        EMAIL = "email", "Email"
        WHATSAPP = "whatsapp", "WhatsApp"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    patient = models.ForeignKey(
        "patients.Patient", on_delete=models.CASCADE, null=True, blank=True, related_name="notifications"
    )
    type = models.CharField(max_length=20, choices=Type.choices)
    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.IN_APP)
    title = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.recipient}"
