from django.contrib import admin
from .models import PathologyCategory, Exercise, ExerciseProgram, ProgramExercise

@admin.register(PathologyCategory)
class PathologyCategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'difficulty', 'is_active']
    list_filter = ['difficulty', 'is_active']
    search_fields = ['name']

@admin.register(ExerciseProgram)
class ExerciseProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'patient', 'created_by', 'start_date', 'end_date']
    list_filter = ['start_date']
    search_fields = ['title']

@admin.register(ProgramExercise)
class ProgramExerciseAdmin(admin.ModelAdmin):
    list_display = ['program', 'exercise', 'repetitions', 'duration', 'order']
