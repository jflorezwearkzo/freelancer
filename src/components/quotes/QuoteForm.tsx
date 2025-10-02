'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { createQuote, updateQuote } from '@/lib/storage';
import { Quote, Client } from '@/lib/types';

interface QuoteFormProps {
  quote?: Quote | null;
  clients: Client[];
  onSave: () => void;
  onCancel: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  quote,
  clients,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    status: 'draft' as 'draft' | 'sent' | 'accepted' | 'rejected',
    validUntil: '',
    clientId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quote) {
      setFormData({
        title: quote.title,
        description: quote.description || '',
        amount: quote.amount.toString(),
        status: quote.status,
        validUntil: quote.validUntil ? quote.validUntil.split('T')[0] : '',
        clientId: quote.clientId
      });
    }
  }, [quote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const quoteData = {
        title: formData.title,
        description: formData.description || undefined,
        amount: parseFloat(formData.amount),
        status: formData.status,
        validUntil: formData.validUntil || undefined,
        clientId: formData.clientId,
        userId: user.id
      };

      if (quote) {
        updateQuote(quote.id, quoteData);
      } else {
        createQuote(quoteData);
      }

      onSave();
    } catch (err) {
      setError('Error al guardar la cotización');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Plantillas predefinidas
  const templates = [
    {
      name: 'Sitio Web Básico',
      description: 'Desarrollo de sitio web corporativo con diseño responsivo, hasta 5 páginas, formulario de contacto y optimización SEO básica.',
      amount: 2500
    },
    {
      name: 'E-commerce',
      description: 'Tienda online completa con carrito de compras, pasarela de pagos, gestión de inventario y panel administrativo.',
      amount: 5000
    },
    {
      name: 'Branding Completo',
      description: 'Diseño de identidad corporativa incluyendo logo, paleta de colores, tipografías, manual de marca y aplicaciones básicas.',
      amount: 1800
    },
    {
      name: 'Campaña Digital',
      description: 'Estrategia y ejecución de campaña publicitaria digital en redes sociales por 3 meses, incluyendo creativos y reportes.',
      amount: 3200
    }
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      amount: template.amount.toString()
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {quote ? 'Editar Cotización' : 'Nueva Cotización'}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título de la Cotización *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ej: Desarrollo Sitio Web Corporativo"
                    />
                  </div>

                  <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente *
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      required
                      value={formData.clientId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} {client.company && `- ${client.company}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Monto *
                    </label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
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
                      <option value="draft">Borrador</option>
                      <option value="sent">Enviada</option>
                      <option value="accepted">Aceptada</option>
                      <option value="rejected">Rechazada</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
                      Válida Hasta
                    </label>
                    <Input
                      id="validUntil"
                      name="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del Servicio
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe detalladamente el servicio o producto que estás cotizando..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                    {loading ? 'Guardando...' : (quote ? 'Actualizar' : 'Crear Cotización')}
                  </Button>
                </div>
              </form>
            </div>

            {/* Plantillas */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Plantillas Rápidas</h3>
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-2">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-green-600">
                          ${template.amount.toLocaleString()}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => applyTemplate(template)}
                          className="text-xs"
                        >
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-900 mb-2">💡 Consejos</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Sé específico en la descripción</li>
                  <li>• Incluye entregables claros</li>
                  <li>• Define plazos de entrega</li>
                  <li>• Especifica qué incluye y qué no</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
