'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { createContract, updateContract } from '@/lib/storage';
import { Contract, Client } from '@/lib/types';

interface ContractFormProps {
  contract?: Contract | null;
  clients: Client[];
  onSave: () => void;
  onCancel: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
  contract,
  clients,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'sent' | 'signed' | 'expired',
    clientId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title,
        content: contract.content,
        status: contract.status,
        clientId: contract.clientId
      });
    }
  }, [contract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const contractData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        clientId: formData.clientId,
        userId: user.id
      };

      if (contract) {
        updateContract(contract.id, contractData);
      } else {
        createContract(contractData);
      }

      onSave();
    } catch (err) {
      setError('Error al guardar el contrato');
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

  // Plantillas de contratos predefinidas
  const templates = [
    {
      name: 'Contrato de Desarrollo Web',
      content: `CONTRATO DE DESARROLLO WEB

PARTES:
Desarrollador: [TU NOMBRE]
Cliente: [NOMBRE DEL CLIENTE]

OBJETO DEL CONTRATO:
El presente contrato tiene por objeto el desarrollo de un sitio web según las especificaciones acordadas.

ALCANCE DEL TRABAJO:
- Diseño y desarrollo del sitio web
- Implementación de funcionalidades acordadas
- Optimización para dispositivos móviles
- Optimización básica SEO
- Capacitación básica al cliente

PLAZOS:
El proyecto se entregará en un plazo máximo de [X] semanas a partir de la firma del contrato.

PRECIO Y FORMA DE PAGO:
El precio total del proyecto es de $[MONTO] pesos, pagaderos de la siguiente forma:
- 50% al firmar el contrato
- 50% al finalizar el proyecto

DERECHOS DE AUTOR:
Una vez completado el pago total, todos los derechos del sitio web serán transferidos al cliente.

GARANTÍA:
Se ofrece garantía de 30 días por errores de programación después de la entrega final.

MODIFICACIONES:
Cualquier modificación al alcance original será cotizada por separado.

Lugar y fecha: _______________

Firmas:
Desarrollador: _______________
Cliente: _______________`
    },
    {
      name: 'Contrato de Diseño Gráfico',
      content: `CONTRATO DE SERVICIOS DE DISEÑO GRÁFICO

PARTES:
Diseñador: [TU NOMBRE]
Cliente: [NOMBRE DEL CLIENTE]

SERVICIOS A PRESTAR:
- Diseño de identidad visual
- Creación de logo y elementos gráficos
- Manual de marca básico
- Aplicaciones en papelería

PROCESO DE TRABAJO:
1. Brief y recopilación de información
2. Presentación de propuestas iniciales
3. Revisiones y ajustes (máximo 3 rondas)
4. Entrega de archivos finales

ENTREGABLES:
- Logo en diferentes formatos (AI, PNG, JPG, SVG)
- Paleta de colores
- Tipografías utilizadas
- Manual de uso básico

PRECIO: $[MONTO]
FORMA DE PAGO:
- 50% anticipo
- 50% contra entrega

REVISIONES:
Se incluyen hasta 3 rondas de revisiones. Revisiones adicionales tendrán un costo extra.

DERECHOS:
Los derechos de uso comercial se transfieren al cliente una vez completado el pago.

Firmas:
Diseñador: _______________
Cliente: _______________`
    },
    {
      name: 'Contrato de Marketing Digital',
      content: `CONTRATO DE SERVICIOS DE MARKETING DIGITAL

PARTES:
Agencia/Consultor: [TU NOMBRE]
Cliente: [NOMBRE DEL CLIENTE]

SERVICIOS INCLUIDOS:
- Gestión de redes sociales
- Creación de contenido
- Pauta publicitaria
- Reportes mensuales de resultados

DURACIÓN:
El presente contrato tendrá una duración de [X] meses, renovable automáticamente.

INVERSIÓN PUBLICITARIA:
El cliente destinará un presupuesto mínimo de $[MONTO] mensuales para pauta publicitaria, adicional a los honorarios por gestión.

HONORARIOS:
$[MONTO] mensuales por servicios de gestión y estrategia.

COMPROMISOS DEL CLIENTE:
- Proporcionar accesos necesarios a plataformas
- Facilitar información y materiales requeridos
- Aprobar contenidos en tiempo y forma

MÉTRICAS Y OBJETIVOS:
Se establecen los siguientes KPIs:
- [Métrica 1]
- [Métrica 2]
- [Métrica 3]

TERMINACIÓN:
Cualquier parte puede terminar el contrato con 30 días de anticipación.

Firmas:
Consultor: _______________
Cliente: _______________`
    }
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.name,
      content: template.content
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {contract ? 'Editar Contrato' : 'Nuevo Contrato'}
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Formulario */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título del Contrato *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ej: Contrato de Desarrollo Web - Cliente XYZ"
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
                      <option value="sent">Enviado</option>
                      <option value="signed">Firmado</option>
                      <option value="expired">Expirado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido del Contrato *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={20}
                    required
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Escribe aquí el contenido completo del contrato..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
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
                    {loading ? 'Guardando...' : (contract ? 'Actualizar' : 'Crear Contrato')}
                  </Button>
                </div>
              </form>
            </div>

            {/* Plantillas */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Plantillas</h3>
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-2">{template.name}</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => applyTemplate(template)}
                        className="w-full text-xs"
                      >
                        Usar Plantilla
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-sm text-amber-900 mb-2">⚖️ Importante</h4>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• Revisa las leyes locales</li>
                  <li>• Consulta con un abogado</li>
                  <li>• Personaliza según tu caso</li>
                  <li>• Define claramente el alcance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
