'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProjectForm from '@/components/ProjectForm';
import ProjectList from '@/components/ProjectList';
import ImportData from '@/components/ImportData';
import { exportToCSV, exportToJSON } from '@/lib/export';
import { Download } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  address: string;
  description?: string;
  status: string;
  dateStarted: string;
  dateCompleted?: string;
  unitsCompleted: number;
  unitsPlanned?: number;
  qualityRating?: number;
  supervisor?: string;
  notes?: string;
  issues?: string;
}

interface ProjectFormData {
  name: string;
  address: string;
  description?: string;
  dateStarted: string;
  dateCompleted?: string;
  unitsPlanned?: number;
  qualityRating?: number;
  supervisor?: string;
  notes?: string;
  issues?: string;
  status?: string;
}

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'new');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create project');
      
      setShowForm(false);
      router.push('/projects');
      await fetchProjects();
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Projects</h1>
        <div className="flex gap-2 flex-wrap">
          {!showForm && (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                New Project
              </button>
              {projects.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(projects, `projects-${new Date().toISOString().split('T')[0]}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    <Download size={18} />
                    Export CSV
                  </button>
                  <button
                    onClick={() => exportToJSON(projects, `projects-${new Date().toISOString().split('T')[0]}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Download size={18} />
                    Export JSON
                  </button>
                </>
              )}
              <ImportData onImportComplete={fetchProjects} />
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {showForm ? (
        <div>
          <button
            onClick={() => setShowForm(false)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Projects
          </button>
          <ProjectForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : (
            <ProjectList
              projects={projects}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}
