'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, Calendar, Eye, Edit, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getQuotesByUserId, getClientsByUserId, updateQuote } from '@/lib/storage';
import { Quote, Client } from '@/lib/types';
import { QuoteForm } from './QuoteForm';

export const QuoteList: React.FC = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (user) {
      const userQuotes = getQuotesByUserId(user.id);
      const userClients = getClientsByUserId(user.id);
      setQuotes(userQuotes);
      setClients(userClients);
    }
  }, [user]);

  useEffect(() => {
    let filtered = quotes;

    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, statusFilter]);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviada';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const handleQuoteSaved = () => {
    if (user) {
      setQuotes(getQuotesByUserId(user.id));
    }
    setShowForm(false);
    setEditingQuote(null);
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    updateQuote(quoteId, { status: newStatus });
    if (user) {
      setQuotes(getQuotesByUserId(user.id));
    }
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const totalValue = quotes
    .filter(q => q.status === 'accepted')
    .reduce((sum, q) => sum + q.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cotizaciones</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tus propuestas comerciales y cotizaciones
          </p>
          <p className="text-sm text-green-600 font-medium">
            Total aceptado: ${totalValue.toLocaleString()}
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cotización
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar cotizaciones..."
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
          <option value="sent">Enviadas</option>
          <option value="accepted">Aceptadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>

      {/* Lista de Cotizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => {
          const expired = isExpired(quote.validUntil);
          
          return (
            <Card key={quote.id} className={`hover:shadow-lg transition-shadow ${expired && quote.status === 'sent' ? 'border-orange-200' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{quote.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {getClientName(quote.clientId)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {getStatusText(quote.status)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {quote.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-lg font-bold text-green-600">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {quote.amount.toLocaleString()}
                    </div>
                    {expired && quote.status === 'sent' && (
                      <span className="text-xs text-orange-600 font-medium">
                        Vencida
                      </span>
                    )}
                  </div>

                  {quote.validUntil && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Válida hasta: {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Creada: {new Date(quote.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex space-x-1">
                      {quote.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(quote.id, 'sent')}
                          className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Enviar
                        </button>
                      )}
                      {quote.status === 'sent' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(quote.id, 'accepted')}
                            className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleStatusChange(quote.id, 'rejected')}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleEdit(quote)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hay cotizaciones</div>
          <p className="text-gray-500 mb-4">
            {quotes.length === 0 
              ? 'Crea tu primera cotización para empezar'
              : 'No se encontraron cotizaciones con los filtros aplicados'
            }
          </p>
          {quotes.length === 0 && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Cotización
            </Button>
          )}
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <QuoteForm
          quote={editingQuote}
          clients={clients}
          onSave={handleQuoteSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingQuote(null);
          }}
        />
      )}
    </div>
  );
};
