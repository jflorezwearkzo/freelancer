'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Building, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getClientsByUserId, deleteClient, getProjectsByUserId } from '@/lib/storage';
import { Client, Project } from '@/lib/types';
import { ClientForm } from './ClientForm';

export const ClientList: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      const userProjects = getProjectsByUserId(user.id);
      setClients(userClients);
      setProjects(userProjects);
    }
  }, [user]);

  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'prospect': return 'Prospecto';
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const getClientProjects = (clientId: string) => {
    return projects.filter(project => project.clientId === clientId);
  };

  const handleClientSaved = () => {
    if (user) {
      setClients(getClientsByUserId(user.id));
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      deleteClient(clientId);
      if (user) {
        setClients(getClientsByUserId(user.id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu cartera de clientes y prospectos
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
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
          <option value="prospect">Prospectos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const clientProjects = getClientProjects(client.id);
          const activeProjects = clientProjects.filter(p => p.status === 'active').length;
          
          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    {client.company && (
                      <CardDescription className="mt-1 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {client.company}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {getStatusText(client.status)}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a 
                      href={`mailto:${client.email}`}
                      className="hover:text-blue-600 truncate"
                    >
                      {client.email}
                    </a>
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a 
                        href={`tel:${client.phone}`}
                        className="hover:text-blue-600"
                      >
                        {client.phone}
                      </a>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Proyectos:</span>
                      <span className="font-medium">
                        {activeProjects} activos / {clientProjects.length} total
                      </span>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="pt-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">Notas:</span> {client.notes}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Agregado: {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                      title="Eliminar cliente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hay clientes</div>
          <p className="text-gray-500 mb-4">
            {clients.length === 0 
              ? 'Agrega tu primer cliente para empezar'
              : 'No se encontraron clientes con los filtros aplicados'
            }
          </p>
          {clients.length === 0 && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Primer Cliente
            </Button>
          )}
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSave={handleClientSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
};
