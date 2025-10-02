'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { createTeamMember, updateTeamMember } from '@/lib/storage';
import { TeamMember } from '@/lib/types';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSave: () => void;
  onCancel: () => void;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  member,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const memberData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        userId: user.id
      };

      if (member) {
        updateTeamMember(member.id, memberData);
      } else {
        createTeamMember(memberData);
      }

      onSave();
    } catch (err) {
      setError('Error al guardar el miembro del equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Roles predefinidos comunes
  const commonRoles = [
    'Desarrollador Frontend',
    'Desarrollador Backend',
    'Desarrollador Full Stack',
    'Diseñador UI/UX',
    'Diseñador Gráfico',
    'Copywriter',
    'Community Manager',
    'Especialista en SEO',
    'Project Manager',
    'QA Tester',
    'Fotógrafo',
    'Videoeditor',
    'Consultor Marketing',
    'Freelancer General'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {member ? 'Editar Miembro del Equipo' : 'Nuevo Miembro del Equipo'}
            </CardTitle>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: María González"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="maria@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol/Especialidad *
                </label>
                <div className="space-y-2">
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Ej: Desarrollador Frontend"
                    list="roles"
                  />
                  <datalist id="roles">
                    {commonRoles.map((role) => (
                      <option key={role} value={role} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-blue-900 mb-2">💡 Consejos para gestionar tu equipo</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Define claramente las responsabilidades de cada rol</li>
                <li>• Asigna tareas específicas a cada miembro</li>
                <li>• Mantén comunicación regular con tu equipo</li>
                <li>• Establece plazos realistas para las entregas</li>
                <li>• Reconoce y celebra los logros del equipo</li>
              </ul>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Guardando...' : (member ? 'Actualizar' : 'Agregar Miembro')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
