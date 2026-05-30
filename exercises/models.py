import uuid
from django.db import models


class PathologyCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Pathology Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Exercise(models.Model):
    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    pathology_categories = models.ManyToManyField(PathologyCategory, related_name="exercises")
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    repetitions = models.CharField(max_length=50, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="exercises/", blank=True, null=True)
    video_url = models.URLField(blank=True)
    instructions = models.TextField(blank=True)
    precautions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ExerciseProgram(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey("patients.Patient", on_delete=models.CASCADE, related_name="exercise_programs")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    exercises = models.ManyToManyField(Exercise, through="ProgramExercise")
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.patient}"


class ProgramExercise(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    program = models.ForeignKey(ExerciseProgram, on_delete=models.CASCADE)
    repetitions = models.CharField(max_length=50, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
