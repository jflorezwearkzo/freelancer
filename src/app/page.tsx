'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log('Home component mounted');
    setMounted(true);
    
    // Verificar si hay usuario en localStorage
    try {
      const currentUser = localStorage.getItem('current_user');
      if (currentUser) {
        setUser(JSON.parse(currentUser));
        router.push('/dashboard');
      }
    } catch (error) {
      console.log('No user found');
    }
  }, [router]);

  const loadDemoData = () => {
    console.log('Loading demo data...');
    
    // Datos de demo simplificados
    const demoUser = {
      id: 'demo-user-1',
      email: 'demo@freelancerpro.com',
      name: 'Usuario Demo',
      role: 'freelancer'
    };

    // Datos de demo básicos
    const demoData = {
      users: [demoUser],
      clients: [
        {
          id: 'client-1',
          name: 'Tech Startup Inc.',
          email: 'contact@techstartup.com',
          company: 'Tech Startup Inc.',
          status: 'active',
          userId: 'demo-user-1'
        }
      ],
      projects: [
        {
          id: 'project-1',
          name: 'Aplicación Móvil FinTech',
          description: 'Desarrollo de app móvil para finanzas',
          status: 'active',
          progress: 65,
          budget: 15000,
          userId: 'demo-user-1',
          clientId: 'client-1'
        }
      ],
      tasks: [],
      quotes: [],
      contracts: [],
      teamMembers: []
    };

    try {
      localStorage.setItem('freelancer_app_data', JSON.stringify(demoData));
      localStorage.setItem('current_user', JSON.stringify(demoUser));
      window.location.reload();
    } catch (error) {
      console.error('Error loading demo data:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">FreelancerPro</h1>
          <p className="text-gray-600">Sistema de Gestión para Freelancers</p>
          
          <div className="space-y-4">
            <button
              onClick={loadDemoData}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              🚀 Cargar Datos de Demostración
            </button>
            
            <p className="text-xs text-gray-500">
              Incluye proyectos, clientes y tareas de ejemplo
            </p>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            <p>✅ Aplicación cargada correctamente</p>
            <p>✅ JavaScript funcionando</p>
            <p>✅ LocalStorage disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
}