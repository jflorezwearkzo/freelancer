'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, User, Edit, Trash2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getTeamMembersByUserId, getTasksByUserId, deleteTeamMember } from '@/lib/storage';
import { TeamMember, Task } from '@/lib/types';
import { TeamMemberForm } from './TeamMemberForm';

export const TeamList: React.FC = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (user) {
      const userMembers = getTeamMembersByUserId(user.id);
      const userTasks = getTasksByUserId(user.id);
      setTeamMembers(userMembers);
      setTasks(userTasks);
    }
  }, [user]);

  useEffect(() => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredMembers(filtered);
  }, [teamMembers, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const getMemberTasks = (memberId: string) => {
    return tasks.filter(task => task.assigneeId === memberId);
  };

  const getActiveTasks = (memberId: string) => {
    return getMemberTasks(memberId).filter(task => 
      task.status === 'pending' || task.status === 'in_progress'
    );
  };

  const handleMemberSaved = () => {
    if (user) {
      setTeamMembers(getTeamMembersByUserId(user.id));
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (memberId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este miembro del equipo?')) {
      deleteTeamMember(memberId);
      if (user) {
        setTeamMembers(getTeamMembersByUserId(user.id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipo</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu equipo de colaboradores y freelancers
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Miembro
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar miembros del equipo..."
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
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {/* Lista de Miembros del Equipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const memberTasks = getMemberTasks(member.id);
          const activeTasks = getActiveTasks(member.id);
          const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
          
          return (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {member.role}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {getStatusText(member.status)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a 
                      href={`mailto:${member.email}`}
                      className="hover:text-blue-600 truncate"
                    >
                      {member.email}
                    </a>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{activeTasks.length}</div>
                        <div className="text-xs text-gray-500">Tareas Activas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                        <div className="text-xs text-gray-500">Completadas</div>
                      </div>
                    </div>
                  </div>

                  {activeTasks.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tareas Activas:</h4>
                      <div className="space-y-1">
                        {activeTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="text-xs text-gray-600 flex items-center">
                            <UserCheck className="h-3 w-3 mr-1" />
                            <span className="truncate">{task.title}</span>
                          </div>
                        ))}
                        {activeTasks.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{activeTasks.length - 3} más...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Agregado: {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                        title="Editar miembro"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                        title="Eliminar miembro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hay miembros del equipo</div>
          <p className="text-gray-500 mb-4">
            {teamMembers.length === 0 
              ? 'Agrega tu primer colaborador para empezar'
              : 'No se encontraron miembros con los filtros aplicados'
            }
          </p>
          {teamMembers.length === 0 && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Primer Miembro
            </Button>
          )}
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onSave={handleMemberSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
};
