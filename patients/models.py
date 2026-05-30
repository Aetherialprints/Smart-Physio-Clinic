import uuid
from django.conf import settings
from django.db import models


class Patient(models.Model):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=Gender.choices)
    date_of_birth = models.DateField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    photo = models.ImageField(upload_to="patients/", blank=True, null=True)
    pathology = models.CharField(max_length=200)
    diagnosis = models.TextField(blank=True)
    treatment_plan = models.TextField(blank=True)
    total_sessions = models.PositiveIntegerField(default=0)
    session_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remaining_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    medical_notes = models.TextField(blank=True)
    physiotherapist = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="patients"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_patients"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))

    def save(self, *args, **kwargs):
        self.total_amount = self.total_sessions * self.session_price
        self.remaining_balance = self.total_amount - self.amount_paid
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
