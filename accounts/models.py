import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Administrator'
        PHYSIOTHERAPIST = 'physiotherapist', 'Physiotherapist'
        SECRETARY = 'secretary', 'Secretary'

    username = None
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PHYSIOTHERAPIST)
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='users/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    specialization = models.CharField(max_length=200, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_physiotherapist(self):
        return self.role == self.Role.PHYSIOTHERAPIST

    @property
    def is_secretary(self):
        return self.role == self.Role.SECRETARY

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
