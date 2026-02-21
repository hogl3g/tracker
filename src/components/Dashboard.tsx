'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  averageQualityRating: number;
  totalUnitsCompleted: number;
  totalUnitsPlanned: number;
  chartData: Array<{
    name: string;
    completed: number;
    planned: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
}

interface Project {
  id: string;
  name: string;
  status: string;
  unitsCompleted: number;
  unitsPlanned?: number;
  qualityRating?: number;
  dateStarted: string;
  dateCompleted?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects: Project[] = await response.json();

        const totalProjects = projects.length;
        const activeProjects = projects.filter((p) => p.status === 'active').length;
        const completedProjects = projects.filter((p) => p.status === 'completed').length;
        const onHoldProjects = projects.filter((p) => p.status === 'on-hold').length;

        const qualityRatings = projects.filter((p) => p.qualityRating).map((p) => p.qualityRating as number);
        const averageQualityRating =
          qualityRatings.length > 0
            ? (qualityRatings.reduce((a, b) => a + b, 0) / qualityRatings.length).toFixed(1)
            : 0;

        const totalUnitsCompleted = projects.reduce((sum, p) => sum + (p.unitsCompleted || 0), 0);
        const totalUnitsPlanned = projects.reduce((sum, p) => sum + (p.unitsPlanned || 0), 0);

        const chartData = projects
          .slice(0, 10)
          .map((p) => ({
            name: p.name.substring(0, 15),
            completed: p.unitsCompleted || 0,
            planned: p.unitsPlanned || 0,
          }));

        const statusData = [
          { name: 'Active', value: activeProjects },
          { name: 'Completed', value: completedProjects },
          { name: 'On Hold', value: onHoldProjects },
        ];

        setMetrics({
          totalProjects,
          activeProjects,
          completedProjects,
          onHoldProjects,
          averageQualityRating: parseFloat(averageQualityRating as string),
          totalUnitsCompleted,
          totalUnitsPlanned,
          chartData,
          statusData,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded text-red-700">
        {error || 'Failed to load dashboard'}
      </div>
    );
  }

  const completionPercentage =
    metrics.totalUnitsPlanned > 0
      ? Math.round((metrics.totalUnitsCompleted / metrics.totalUnitsPlanned) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Total Projects</p>
          <p className="text-4xl font-bold text-gray-900">{metrics.totalProjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Active Projects</p>
          <p className="text-4xl font-bold text-blue-600">{metrics.activeProjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Completed Projects</p>
          <p className="text-4xl font-bold text-green-600">{metrics.completedProjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Average Quality</p>
          <p className="text-4xl font-bold text-orange-600">{metrics.averageQualityRating}/10</p>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Completion</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">{completionPercentage}%</span>
            <span className="text-gray-600">{metrics.totalUnitsCompleted}/{metrics.totalUnitsPlanned}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {metrics.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 font-semibold">Active</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.activeProjects}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 font-semibold">Completed</p>
            <p className="text-3xl font-bold text-green-600">{metrics.completedProjects}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-600 font-semibold">On Hold</p>
            <p className="text-3xl font-bold text-yellow-600">{metrics.onHoldProjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
