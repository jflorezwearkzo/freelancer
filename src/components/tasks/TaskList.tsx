'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getTasksByUserId, getProjectsByUserId, updateTask } from '@/lib/storage';
import { Task, Project } from '@/lib/types';
import { TaskForm } from './TaskForm';

export const TaskList: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      const userTasks = getTasksByUserId(user.id);
      const userProjects = getProjectsByUserId(user.id);
      setTasks(userTasks);
      setProjects(userProjects);
    }
  }, [user]);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Ordenar por prioridad y fecha de vencimiento
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'Sin proyecto';
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Proyecto desconocido';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const handleTaskSaved = () => {
    if (user) {
      setTasks(getTasksByUserId(user.id));
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
    if (user) {
      setTasks(getTasksByUserId(user.id));
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
          <p className="mt-2 text-gray-600">
            Organiza y da seguimiento a todas tus tareas
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate);
          const overdue = isOverdue(task.dueDate);
          
          return (
            <Card key={task.id} className={`hover:shadow-lg transition-shadow ${overdue && task.status !== 'completed' ? 'border-red-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={() => handleStatusChange(
                          task.id, 
                          task.status === 'completed' ? 'pending' : 'completed'
                        )}
                        className={`p-1 rounded-full ${
                          task.status === 'completed' 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      
                      <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      
                      <AlertCircle className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {getProjectName(task.projectId)}
                      </div>
                      
                      {task.dueDate && (
                        <div className={`flex items-center ${overdue && task.status !== 'completed' ? 'text-red-600' : ''}`}>
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                          {daysUntilDue !== null && task.status !== 'completed' && (
                            <span className="ml-1">
                              {overdue ? '(Vencida)' : `(${daysUntilDue} días)`}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} border-current`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </div>
                    
                    <div className="flex space-x-1">
                      {task.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(task.id, 'in_progress')}
                            className={`px-3 py-1 text-xs rounded ${
                              task.status === 'in_progress' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-blue-100'
                            }`}
                          >
                            En Progreso
                          </button>
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            Completar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hay tareas</div>
          <p className="text-gray-500 mb-4">
            {tasks.length === 0 
              ? 'Crea tu primera tarea para empezar'
              : 'No se encontraron tareas con los filtros aplicados'
            }
          </p>
          {tasks.length === 0 && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Tarea
            </Button>
          )}
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <TaskForm
          task={editingTask}
          projects={projects}
          onSave={handleTaskSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
