'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Calendar, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getContractsByUserId, getClientsByUserId, updateContract } from '@/lib/storage';
import { Contract, Client } from '@/lib/types';
import { ContractForm } from './ContractForm';

export const ContractList: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (user) {
      const userContracts = getContractsByUserId(user.id);
      const userClients = getClientsByUserId(user.id);
      setContracts(userContracts);
      setClients(userClients);
    }
  }, [user]);

  useEffect(() => {
    let filtered = contracts;

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredContracts(filtered);
  }, [contracts, searchTerm, statusFilter]);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviado';
      case 'signed': return 'Firmado';
      case 'expired': return 'Expirado';
      default: return status;
    }
  };

  const handleContractSaved = () => {
    if (user) {
      setContracts(getContractsByUserId(user.id));
    }
    setShowForm(false);
    setEditingContract(null);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  const handleStatusChange = (contractId: string, newStatus: Contract['status']) => {
    const updateData: Partial<Contract> = { status: newStatus };
    if (newStatus === 'signed') {
      updateData.signedDate = new Date().toISOString();
    }
    
    updateContract(contractId, updateData);
    if (user) {
      setContracts(getContractsByUserId(user.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tus contratos y acuerdos legales
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Contrato
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar contratos..."
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
          <option value="draft">Borradores</option>
          <option value="sent">Enviados</option>
          <option value="signed">Firmados</option>
          <option value="expired">Expirados</option>
        </select>
      </div>

      {/* Lista de Contratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {contract.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {getClientName(contract.clientId)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="line-clamp-3">
                    {contract.content.substring(0, 150)}...
                  </p>
                </div>

                {contract.signedDate && (
                  <div className="flex items-center text-sm text-green-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Firmado: {new Date(contract.signedDate).toLocaleDateString()}
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Creado: {new Date(contract.createdAt).toLocaleDateString()}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex space-x-1">
                    {contract.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(contract.id, 'sent')}
                        className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Enviar
                      </button>
                    )}
                    {contract.status === 'sent' && (
                      <button
                        onClick={() => handleStatusChange(contract.id, 'signed')}
                        className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Marcar Firmado
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(contract)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Editar contrato"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hay contratos</div>
          <p className="text-gray-500 mb-4">
            {contracts.length === 0 
              ? 'Crea tu primer contrato para empezar'
              : 'No se encontraron contratos con los filtros aplicados'
            }
          </p>
          {contracts.length === 0 && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Contrato
            </Button>
          )}
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <ContractForm
          contract={editingContract}
          clients={clients}
          onSave={handleContractSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingContract(null);
          }}
        />
      )}
    </div>
  );
};
