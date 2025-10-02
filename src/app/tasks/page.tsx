'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getTasksByUserId, createTask, updateTask, getProjectsByUserId } from '@/lib/storage';
import { User, Task, Project } from '@/lib/types';
import AppLayout from '@/components/layout/AppLayout';

export default function TasksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedProject = searchParams.get('project');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: selectedProject || '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    dueDate: ''
  });

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    
    setUser(currentUser);
    loadData(currentUser.id);
  }, [router]);

  const loadData = (userId: string) => {
    const taskData = getTasksByUserId(userId);
    const projectData = getProjectsByUserId(userId);
    setTasks(taskData);
    setProjects(projectData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const taskData = {
      ...formData,
      userId: user.id,
      projectId: projects.find(p => p.name === formData.project)?.id || ''
    };

    if (editingTask) {
      // Update existing task
      const updated = updateTask(editingTask.id, taskData);
      if (updated) {
        loadData(user.id);
        resetForm();
      }
    } else {
      // Create new task
      createTask(taskData);
      loadData(user.id);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      project: selectedProject || '',
      priority: 'medium',
      status: 'pending',
      dueDate: ''
    });
    setEditingTask(null);
    setShowModal(false);
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || ''
    });
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: 'pending' | 'in-progress' | 'completed') => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus });
      if (user) loadData(user.id);
    }
    setDraggedTask(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusTasks = (status: 'pending' | 'in-progress' | 'completed') => {
    return tasks.filter(task => task.status === status);
  };

  const columns = [
    {
      id: 'pending',
      title: 'Por Hacer',
      icon: '📝',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300',
      tasks: getStatusTasks('pending')
    },
    {
      id: 'in-progress',
      title: 'En Progreso',
      icon: '🚀',
      color: 'bg-blue-100',
      borderColor: 'border-blue-300',
      tasks: getStatusTasks('in-progress')
    },
    {
      id: 'completed',
      title: 'Completadas',
      icon: '✅',
      color: 'bg-green-100',
      borderColor: 'border-green-300',
      tasks: getStatusTasks('completed')
    }
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestión de Tareas ✅</h1>
                <p className="text-yellow-100 text-lg">
                  Organiza tu trabajo con nuestro sistema Kanban
                </p>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-3xl font-bold">{totalTasks}</div>
                <div className="text-yellow-200 text-sm">Total de tareas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Alta Prioridad</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityTasks}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vencidas</p>
                <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Tablero Kanban</h2>
              {selectedProject && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Proyecto: {projects.find(p => p.id === selectedProject)?.name}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-2xl p-6 min-h-[600px] border-2 border-dashed ${column.borderColor}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as any)}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{column.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{column.title}</h3>
                </div>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                  {column.tasks.length}
                </span>
              </div>

              <div className="space-y-4">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-move border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {task.project && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                            {task.project}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'Alta' : 
                           task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      {task.dueDate && (
                        <span className={`font-medium ${
                          new Date(task.dueDate) < new Date() && task.status !== 'completed'
                            ? 'text-red-600' 
                            : 'text-gray-500'
                        }`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl block mb-2">{column.icon}</span>
                    <p className="text-sm">No hay tareas aquí</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={resetForm}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
                      </h3>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Título de la tarea"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Descripción de la tarea..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proyecto
                          </label>
                          <select
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="">Sin proyecto</option>
                            {projects.map(project => (
                              <option key={project.id} value={project.name}>{project.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prioridad
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="low">Baja 🟢</option>
                            <option value="medium">Media 🟡</option>
                            <option value="high">Alta 🔴</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="pending">Por Hacer</option>
                            <option value="in-progress">En Progreso</option>
                            <option value="completed">Completada</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha Límite
                          </label>
                          <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      {editingTask ? 'Actualizar' : 'Crear'} Tarea
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}