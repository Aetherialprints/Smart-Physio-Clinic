from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Exercise, PathologyCategory, ExerciseProgram
from .serializers import ExerciseSerializer, PathologyCategorySerializer, ExerciseProgramSerializer


class ExerciseListView(generics.ListCreateAPIView):
    queryset = Exercise.objects.filter(is_active=True)
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    def get_queryset(self):
        qs = super().get_queryset()
        pathology = self.request.query_params.get('pathology')
        if pathology:
            qs = qs.filter(pathology_categories__id=pathology)
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        return qs


class ExerciseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]


class PathologyCategoryListView(generics.ListCreateAPIView):
    queryset = PathologyCategory.objects.all()
    serializer_class = PathologyCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ExerciseProgramListCreateView(generics.ListCreateAPIView):
    serializer_class = ExerciseProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        qs = ExerciseProgram.objects.all()
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs.select_related('patient', 'created_by')


class ExerciseProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExerciseProgram.objects.all()
    serializer_class = ExerciseProgramSerializer
    permission_classes = [permissions.IsAuthenticated]


class ExercisesByPathologyView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pathology_id):
        exercises = Exercise.objects.filter(pathology_categories__id=pathology_id, is_active=True)
        return Response(ExerciseSerializer(exercises, many=True).data)
