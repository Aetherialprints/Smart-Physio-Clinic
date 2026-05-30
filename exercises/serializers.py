from rest_framework import serializers
from .models import Exercise, PathologyCategory, ExerciseProgram, ProgramExercise


class PathologyCategorySerializer(serializers.ModelSerializer):
    exercise_count = serializers.SerializerMethodField()
    class Meta:
        model = PathologyCategory
        fields = '__all__'
    def get_exercise_count(self, obj):
        return obj.exercises.count()


class ExerciseSerializer(serializers.ModelSerializer):
    pathology_categories_names = serializers.SlugRelatedField(
        source='pathology_categories', read_only=True, slug_field='name', many=True
    )
    class Meta:
        model = Exercise
        fields = '__all__'


class ProgramExerciseSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    class Meta:
        model = ProgramExercise
        fields = ['id', 'exercise', 'exercise_name', 'repetitions', 'duration', 'notes', 'order']


class ExerciseProgramSerializer(serializers.ModelSerializer):
    exercises_details = serializers.SerializerMethodField()
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    class Meta:
        model = ExerciseProgram
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    def get_exercises_details(self, obj):
        pe = ProgramExercise.objects.filter(program=obj).select_related('exercise')
        return ProgramExerciseSerializer(pe, many=True).data
