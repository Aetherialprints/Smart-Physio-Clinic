'use client';

import { useState, useEffect } from 'react';
import { exercisesApi, type Exercise, type PathologyCategory } from '@/services/exerciseService';
import { Button, Badge } from '@/components/ui/Button';
import { Dumbbell, Search, Filter, Clock, Repeat, Tag } from 'lucide-react';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [pathologies, setPathologies] = useState<PathologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPathology, setSelectedPathology] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [exData, pathData] = await Promise.all([
        exercisesApi.list({ search: search || undefined, pathology: selectedPathology || undefined }),
        exercisesApi.pathologies(),
      ]);
      setExercises(exData.results);
      setPathologies(pathData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [search, selectedPathology]);

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
          <p className="text-gray-500 mt-1">Therapeutic exercises organized by pathology</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={selectedPathology}
          onChange={e => setSelectedPathology(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          <option value="">All Pathologies</option>
          {pathologies.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Dumbbell className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">No exercises found</p>
          <p className="text-sm">Run seed command to populate the library</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map(exercise => (
            <div key={exercise.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exercise.pathology_categories_names.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        <Tag className="w-3 h-3" /> {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <Badge variant={difficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{exercise.description}</p>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                {exercise.repetitions && (
                  <span className="flex items-center gap-1">
                    <Repeat className="w-3.5 h-3.5" /> {exercise.repetitions}
                  </span>
                )}
                {exercise.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {exercise.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
