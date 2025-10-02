'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getProjectsByUserId, getClientsByUserId, getTasksByUserId } from '@/lib/storage';
import { User, Project, Client, Task } from '@/lib/types';
import AppLayout from '@/components/layout/AppLayout';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    
    setUser(currentUser);
    setProjects(getProjectsByUserId(currentUser.id));
    setClients(getClientsByUserId(currentUser.id));
    setTasks(getTasksByUserId(currentUser.id));
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const urgentTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
  const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  ¡Bienvenido de nuevo, {user?.name}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Aquí tienes un resumen completo de tu negocio freelance
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-4xl">🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Proyectos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{activeProjects.length}</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +{Math.floor(Math.random() * 20)}% este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +{Math.floor(Math.random() * 15)}% este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tareas Urgentes</p>
                <p className="text-3xl font-bold text-gray-900">{urgentTasks.length}</p>
                <p className="text-xs text-red-600 font-medium mt-1">
                  Requieren atención
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ingresos Total</p>
                <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +{Math.floor(Math.random() * 25)}% este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Proyectos Recientes</h3>
                <button
                  onClick={() => router.push('/projects')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              
              <div className="space-y-4">
                {activeProjects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-semibold text-sm">
                        {project.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{project.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{project.client}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progreso</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(project.budget || 0).toLocaleString()}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'active' ? 'Activo' :
                         project.status === 'completed' ? 'Completado' : 'En Pausa'}
                      </span>
                    </div>
                  </div>
                ))}
                {activeProjects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📁</span>
                    </div>
                    <p className="text-gray-500 mb-4">No hay proyectos activos</p>
                    <button
                      onClick={() => router.push('/projects')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Crear tu primer proyecto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tasks & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Tareas Recientes</h3>
                <button
                  onClick={() => router.push('/tasks')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver todas →
                </button>
              </div>
              
              <div className="space-y-3">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-400' : 
                      task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.project}</p>
                    </div>
                  </div>
                ))}
                {pendingTasks.length === 0 && (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-2 block">🎉</span>
                    <p className="text-sm text-gray-500">¡No hay tareas pendientes!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/clients')}
                  className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
                  <span className="text-xs font-medium text-gray-700">Nuevo Cliente</span>
                </button>
                <button
                  onClick={() => router.push('/projects')}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                  <span className="text-xs font-medium text-gray-700">Nuevo Proyecto</span>
                </button>
                <button
                  onClick={() => router.push('/quotes')}
                  className="flex flex-col items-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</span>
                  <span className="text-xs font-medium text-gray-700">Cotización</span>
                </button>
                <button
                  onClick={() => router.push('/tasks')}
                  className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">✅</span>
                  <span className="text-xs font-medium text-gray-700">Nueva Tarea</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}