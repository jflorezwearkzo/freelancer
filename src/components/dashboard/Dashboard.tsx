'use client';

import React, { useEffect, useState } from 'react';
import { 
  FolderOpen, 
  Users, 
  CheckSquare, 
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getProjectsByUserId, 
  getClientsByUserId, 
  getTasksByUserId, 
  getQuotesByUserId 
} from '@/lib/storage';
import { Project, Client, Task, Quote } from '@/lib/types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    if (user) {
      setProjects(getProjectsByUserId(user.id));
      setClients(getClientsByUserId(user.id));
      setTasks(getTasksByUserId(user.id));
      setQuotes(getQuotesByUserId(user.id));
    }
  }, [user]);

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const totalRevenue = quotes
    .filter(q => q.status === 'accepted')
    .reduce((sum, q) => sum + q.amount, 0);

  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const urgentTasks = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido de vuelta, {user?.name}. Aquí tienes un resumen de tu negocio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Proyectos Activos"
          value={activeProjects}
          description={`${projects.length} proyectos totales`}
          icon={FolderOpen}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Clientes Activos"
          value={activeClients}
          description={`${clients.length} clientes totales`}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Tareas Pendientes"
          value={pendingTasks}
          description={`${tasks.length} tareas totales`}
          icon={CheckSquare}
          trend={{ value: -5, isPositive: false }}
        />
        <StatsCard
          title="Ingresos"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Cotizaciones aceptadas"
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Proyectos Recientes
            </CardTitle>
            <CardDescription>
              Últimos proyectos actualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-500">
                        {project.status === 'active' && '🟢 Activo'}
                        {project.status === 'planning' && '🟡 Planificación'}
                        {project.status === 'completed' && '✅ Completado'}
                        {project.status === 'cancelled' && '❌ Cancelado'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress}%</p>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay proyectos aún. ¡Crea tu primer proyecto!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Tareas Urgentes
            </CardTitle>
            <CardDescription>
              Tareas con fechas de vencimiento próximas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTasks.length > 0 ? (
                urgentTasks.map((task) => {
                  const dueDate = new Date(task.dueDate!);
                  const isOverdue = dueDate < new Date();
                  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={task.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                          {isOverdue ? '⚠️ Vencida' : `📅 ${daysUntilDue} días`}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {task.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {task.priority === 'medium' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {task.priority === 'low' && <AlertCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay tareas urgentes. ¡Buen trabajo!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
