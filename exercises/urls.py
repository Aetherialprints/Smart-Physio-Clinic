from django.urls import path
from . import views

urlpatterns = [
    path("", views.ExerciseListView.as_view(), name="exercise-list"),
    path("<uuid:pk>/", views.ExerciseDetailView.as_view(), name="exercise-detail"),
    path("pathologies/", views.PathologyCategoryListView.as_view(), name="pathology-list"),
    path("pathology/<uuid:pathology_id>/exercises/", views.ExercisesByPathologyView.as_view(), name="exercises-by-pathology"),
    path("programs/", views.ExerciseProgramListCreateView.as_view(), name="program-list-create"),
    path("programs/<uuid:pk>/", views.ExerciseProgramDetailView.as_view(), name="program-detail"),
]
