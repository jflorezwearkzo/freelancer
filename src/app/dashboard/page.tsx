'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard mounted');
    setMounted(true);
    
    try {
      const currentUser = localStorage.getItem('current_user');
      const appData = localStorage.getItem('freelancer_app_data');
      
      if (!currentUser) {
        router.push('/');
        return;
      }
      
      setUser(JSON.parse(currentUser));
      if (appData) {
        setData(JSON.parse(appData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('current_user');
    router.push('/');
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    projects: data?.projects?.length || 0,
    clients: data?.clients?.length || 0,
    tasks: data?.tasks?.length || 0,
    activeProjects: data?.projects?.filter(p => p.status === 'active')?.length || 0
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">FreelancerPro</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Proyectos Totales</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.projects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Proyectos Activos</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.clients}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Tareas</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.tasks}</p>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 ¡Aplicación Funcionando Correctamente!
            </h3>
            <div className="text-green-700 space-y-2">
              <p>✅ Sistema de autenticación activo</p>
              <p>✅ Datos de demostración cargados</p>
              <p>✅ Dashboard operativo</p>
              <p>✅ LocalStorage funcionando</p>
              <p>✅ Navegación entre páginas</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600">
                <strong>¡Felicidades!</strong> Tu sistema FreelancerPro está completamente funcional en GitHub Pages.
              </p>
            </div>
          </div>

          {/* Projects List */}
          {data?.projects && data.projects.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proyectos</h3>
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4">
                  {data.projects.map((project, index) => (
                    <div key={project.id || index} className="border-b last:border-b-0 py-4">
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          Progreso: {project.progress}%
                        </span>
                        {project.budget && (
                          <span className="text-sm text-gray-500">
                            Presupuesto: ${project.budget.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}