'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, setCurrentUser } from '@/lib/auth';
import { loadDemoData, hasData } from '@/lib/storage';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya está logueado
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await loginUser(email, password);
        if (result.success && result.user) {
          setCurrentUser(result.user);
          router.push('/dashboard');
        } else {
          setError(result.error || 'Credenciales inválidas');
        }
      } else {
        const result = await registerUser(email, password, name);
        if (result.success && result.user) {
          setCurrentUser(result.user);
          router.push('/dashboard');
        } else {
          setError(result.error || 'Error al crear la cuenta');
        }
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    loadDemoData();
    // Login con usuario demo
    const result = await loginUser('admin@freelancer.com', 'admin123');
    if (result.success && result.user) {
      setCurrentUser(result.user);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <nav className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">F</span>
            </div>
            <span className="text-white font-bold text-xl">FreelancerPro</span>
          </div>
          <div className="text-white/80 text-sm">
            Sistema de Gestión para Freelancers
          </div>
        </nav>
      </div>

      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Info */}
            <div className="text-white space-y-8">
              <div>
                <h1 className="text-5xl font-bold mb-4">
                  Gestiona tu negocio
                  <span className="text-blue-300"> como un profesional</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Organiza proyectos, clientes, tareas y contratos en una sola plataforma. 
                  Inspirado en el sistema de Jose Freelancer.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold">Dashboard Inteligente</h3>
                  <p className="text-sm text-blue-200">Métricas y estadísticas en tiempo real</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="font-semibold">CRM Completo</h3>
                  <p className="text-sm text-blue-200">Gestiona clientes y prospectos</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📁</span>
                  </div>
                  <h3 className="font-semibold">Proyectos</h3>
                  <p className="text-sm text-blue-200">Organiza y da seguimiento</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold">Cotizaciones</h3>
                  <p className="text-sm text-blue-200">Plantillas profesionales</p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Accede a tu panel de control' 
                    : 'Únete y organiza tu negocio'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin 
                    ? '¿No tienes cuenta? Regístrate' 
                    : '¿Ya tienes cuenta? Inicia sesión'
                  }
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLoadDemo}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  🚀 Probar con Datos de Demostración
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Explora la plataforma con datos de ejemplo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-center text-white/60 text-sm">
          © 2024 FreelancerPro - Inspirado en el sistema de Jose Freelancer
        </div>
      </div>
    </div>
  );
}