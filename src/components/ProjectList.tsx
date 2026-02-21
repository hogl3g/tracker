'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  address: string;
  status: string;
  dateStarted: string;
  dateCompleted?: string;
  unitsCompleted: number;
  unitsPlanned?: number;
  qualityRating?: number;
  supervisor?: string;
}

interface ProjectListProps {
  projects: Project[];
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
};

export default function ProjectList({
  projects,
  onDelete,
  isLoading = false,
}: ProjectListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No projects found</p>
        <Link href="/projects?action=new" className="text-blue-600 hover:underline mt-2 inline-block">
          Create your first project
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const completionPercentage =
          project.unitsPlanned && project.unitsPlanned > 0
            ? Math.round((project.unitsCompleted / project.unitsPlanned) * 100)
            : 0;

        return (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {project.name}
                </h3>
                <p className="text-gray-600">{project.address}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[project.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {project.supervisor && (
                <div>
                  <p className="text-gray-600 text-sm">Supervisor</p>
                  <p className="font-semibold text-gray-900">{project.supervisor}</p>
                </div>
              )}
              {project.qualityRating && (
                <div>
                  <p className="text-gray-600 text-sm">Quality Rating</p>
                  <p className="font-semibold text-gray-900">{project.qualityRating}/10</p>
                </div>
              )}
              <div>
                <p className="text-gray-600 text-sm">Completion</p>
                <p className="font-semibold text-gray-900">{completionPercentage}%</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Units</p>
                <p className="font-semibold text-gray-900">
                  {project.unitsCompleted}/{project.unitsPlanned || '?'}
                </p>
              </div>
            </div>

            {project.unitsPlanned && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Link
                href={`/projects/${project.id}`}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition"
              >
                View Details
              </Link>
              <Link
                href={`/projects/${project.id}/edit`}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg text-center hover:bg-gray-300 transition"
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id || isLoading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition"
                >
                  {deletingId === project.id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
