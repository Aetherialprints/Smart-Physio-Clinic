import { api } from '@/lib/api';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  pathology_categories: number[];
  pathology_categories_names: string[];
  difficulty: string;
  repetitions: string;
  duration: string;
  image: string | null;
  video_url: string;
  instructions: string;
  precautions: string;
  is_active: boolean;
}

export interface ExerciseProgram {
  id: string;
  patient: string;
  patient_name: string;
  title: string;
  description: string;
  exercises_details: {
    id: number;
    exercise: string;
    exercise_name: string;
    repetitions: string;
    duration: string;
    notes: string;
    order: number;
  }[];
  created_by: string;
  created_by_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface PathologyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const exercisesApi = {
  list: (params?: { pathology?: string; difficulty?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.pathology) q.set('pathology', params.pathology);
    if (params?.difficulty) q.set('difficulty', params.difficulty);
    if (params?.search) q.set('search', params.search);
    const query = q.toString() ? `?${q.toString()}` : '';
    return api.get<{ results: Exercise[] }>(`/exercises/${query}`);
  },

  get: (id: string) => api.get<Exercise>(`/exercises/${id}/`),

  create: (data: Partial<Exercise>) => api.post<Exercise>('/exercises/', data),

  update: (id: string, data: Partial<Exercise>) => api.put<Exercise>(`/exercises/${id}/`, data),

  delete: (id: string) => api.delete(`/exercises/${id}/`),

  pathologies: () => api.get<PathologyCategory[]>('/exercises/pathologies/'),

  byPathology: (pathologyId: string) =>
    api.get<Exercise[]>(`/exercises/pathology/${pathologyId}/exercises/`),

  programs: {
    list: (patientId?: string) => {
      const q = patientId ? `?patient=${patientId}` : '';
      return api.get<{ results: ExerciseProgram[] }>(`/exercises/programs/${q}`);
    },
    get: (id: string) => api.get<ExerciseProgram>(`/exercises/programs/${id}/`),
    create: (data: Partial<ExerciseProgram>) => api.post<ExerciseProgram>('/exercises/programs/', data),
    update: (id: string, data: Partial<ExerciseProgram>) => api.put<ExerciseProgram>(`/exercises/programs/${id}/`, data),
    delete: (id: string) => api.delete(`/exercises/programs/${id}/`),
  },
};
