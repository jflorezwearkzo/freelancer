import { AppData } from './types';

export const demoData: AppData = {
  users: [
    {
      id: 'demo-user-1',
      email: 'demo@freelancerpro.com',
      name: 'Demo User',
      password: '$2a$10$demo.hash.for.password123', // password: "demo123"
      role: 'freelancer',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  clients: [
    {
      id: 'client-1',
      name: 'Tech Startup Inc.',
      email: 'contact@techstartup.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Startup Inc.',
      status: 'active',
      notes: 'Cliente muy colaborativo, siempre paga a tiempo. Especializado en tecnología fintech.',
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
      userId: 'demo-user-1'
    },
    {
      id: 'client-2',
      name: 'María González',
      email: 'maria@restaurante.com',
      phone: '+1 (555) 987-6543',
      company: 'Restaurante La Cocina',
      status: 'active',
      notes: 'Dueña de restaurante, necesita presencia digital. Muy enfocada en la calidad.',
      createdAt: '2024-01-20T00:00:00.000Z',
      updatedAt: '2024-02-05T00:00:00.000Z',
      userId: 'demo-user-1'
    },
    {
      id: 'client-3',
      name: 'Carlos Mendoza',
      email: 'carlos@consultoria.com',
      phone: '+1 (555) 456-7890',
      company: 'Consultoría Estratégica',
      status: 'prospect',
      notes: 'Interesado en rediseño de marca. Reunión programada para la próxima semana.',
      createdAt: '2024-02-10T00:00:00.000Z',
      updatedAt: '2024-02-10T00:00:00.000Z',
      userId: 'demo-user-1'
    }
  ],
  projects: [
    {
      id: 'project-1',
      name: 'Aplicación Móvil FinTech',
      description: 'Desarrollo de aplicación móvil para gestión de finanzas personales con integración bancaria.',
      status: 'active',
      startDate: '2024-01-15T00:00:00.000Z',
      endDate: '2024-04-15T00:00:00.000Z',
      budget: 15000,
      progress: 65,
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-02-15T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-1'
    },
    {
      id: 'project-2',
      name: 'Sitio Web Restaurante',
      description: 'Diseño y desarrollo de sitio web con sistema de reservas online y menú digital.',
      status: 'active',
      startDate: '2024-02-01T00:00:00.000Z',
      endDate: '2024-03-15T00:00:00.000Z',
      budget: 3500,
      progress: 40,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-20T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-2'
    },
    {
      id: 'project-3',
      name: 'E-commerce Completo',
      description: 'Tienda online completa con carrito de compras, pasarela de pagos y panel administrativo.',
      status: 'completed',
      startDate: '2023-11-01T00:00:00.000Z',
      endDate: '2024-01-30T00:00:00.000Z',
      budget: 8000,
      progress: 100,
      createdAt: '2023-11-01T00:00:00.000Z',
      updatedAt: '2024-01-30T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-1'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Diseñar wireframes de la app',
      description: 'Crear wireframes detallados para todas las pantallas de la aplicación móvil.',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-02-01T00:00:00.000Z',
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-28T00:00:00.000Z',
      userId: 'demo-user-1',
      projectId: 'project-1'
    },
    {
      id: 'task-2',
      title: 'Implementar autenticación',
      description: 'Desarrollar sistema de login y registro con validación de email.',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-02-25T00:00:00.000Z',
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-15T00:00:00.000Z',
      userId: 'demo-user-1',
      projectId: 'project-1'
    },
    {
      id: 'task-3',
      title: 'Fotografía de platos',
      description: 'Sesión fotográfica profesional para el menú del restaurante.',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-02-28T00:00:00.000Z',
      createdAt: '2024-02-05T00:00:00.000Z',
      updatedAt: '2024-02-05T00:00:00.000Z',
      userId: 'demo-user-1',
      projectId: 'project-2'
    },
    {
      id: 'task-4',
      title: 'Optimización SEO',
      description: 'Implementar mejores prácticas de SEO y optimizar velocidad de carga.',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-03-10T00:00:00.000Z',
      createdAt: '2024-02-10T00:00:00.000Z',
      updatedAt: '2024-02-10T00:00:00.000Z',
      userId: 'demo-user-1',
      projectId: 'project-2'
    }
  ],
  quotes: [
    {
      id: 'quote-1',
      title: 'Rediseño de Marca Corporativa',
      description: 'Propuesta para rediseño completo de identidad visual incluyendo logo, paleta de colores, tipografías y manual de marca.',
      amount: 2800,
      status: 'sent',
      validUntil: '2024-03-15T00:00:00.000Z',
      createdAt: '2024-02-10T00:00:00.000Z',
      updatedAt: '2024-02-10T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-3'
    },
    {
      id: 'quote-2',
      title: 'Aplicación Móvil FinTech',
      description: 'Desarrollo completo de aplicación móvil para iOS y Android con backend, integración bancaria y panel administrativo.',
      amount: 15000,
      status: 'accepted',
      validUntil: '2024-01-30T00:00:00.000Z',
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-1'
    },
    {
      id: 'quote-3',
      title: 'Sitio Web con Reservas',
      description: 'Desarrollo de sitio web responsivo con sistema de reservas online, menú digital y integración con redes sociales.',
      amount: 3500,
      status: 'accepted',
      validUntil: '2024-02-15T00:00:00.000Z',
      createdAt: '2024-01-25T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-2'
    }
  ],
  contracts: [
    {
      id: 'contract-1',
      title: 'Contrato Desarrollo App FinTech',
      content: `CONTRATO DE DESARROLLO DE SOFTWARE

PARTES:
Desarrollador: FreelancerPro Demo
Cliente: Tech Startup Inc.

OBJETO DEL CONTRATO:
El presente contrato tiene por objeto el desarrollo de una aplicación móvil para gestión de finanzas personales.

ALCANCE DEL TRABAJO:
- Desarrollo de aplicación móvil nativa para iOS y Android
- Backend con API REST
- Integración con servicios bancarios
- Panel administrativo web
- Pruebas y documentación

PLAZOS:
El proyecto se entregará en un plazo máximo de 12 semanas a partir de la firma del contrato.

PRECIO Y FORMA DE PAGO:
El precio total del proyecto es de $15,000 USD, pagaderos de la siguiente forma:
- 30% al firmar el contrato ($4,500)
- 40% al completar el 50% del desarrollo ($6,000)
- 30% al finalizar el proyecto ($4,500)

DERECHOS DE AUTOR:
Una vez completado el pago total, todos los derechos del software serán transferidos al cliente.

GARANTÍA:
Se ofrece garantía de 60 días por errores de programación después de la entrega final.

Lugar y fecha: 15 de Enero, 2024

Firmas:
Desarrollador: [Firmado]
Cliente: [Firmado]`,
      status: 'signed',
      signedDate: '2024-01-15T00:00:00.000Z',
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-1'
    },
    {
      id: 'contract-2',
      title: 'Contrato Sitio Web Restaurante',
      content: `CONTRATO DE DESARROLLO WEB

PARTES:
Desarrollador: FreelancerPro Demo
Cliente: Restaurante La Cocina

OBJETO DEL CONTRATO:
Desarrollo de sitio web corporativo con sistema de reservas online.

SERVICIOS INCLUIDOS:
- Diseño web responsivo
- Sistema de reservas online
- Menú digital interactivo
- Optimización SEO básica
- Capacitación al personal

PRECIO: $3,500 USD
FORMA DE PAGO:
- 50% anticipo ($1,750)
- 50% contra entrega ($1,750)

PLAZO DE ENTREGA: 6 semanas

Firmas:
Desarrollador: [Firmado]
Cliente: [Firmado]`,
      status: 'signed',
      signedDate: '2024-02-01T00:00:00.000Z',
      createdAt: '2024-01-28T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
      userId: 'demo-user-1',
      clientId: 'client-2'
    }
  ],
  teamMembers: [
    {
      id: 'member-1',
      name: 'Ana Rodríguez',
      email: 'ana@freelancerpro.com',
      role: 'Diseñadora UI/UX',
      status: 'active',
      createdAt: '2024-01-20T00:00:00.000Z',
      updatedAt: '2024-01-20T00:00:00.000Z',
      userId: 'demo-user-1'
    },
    {
      id: 'member-2',
      name: 'Roberto Silva',
      email: 'roberto@freelancerpro.com',
      role: 'Desarrollador Backend',
      status: 'active',
      createdAt: '2024-01-25T00:00:00.000Z',
      updatedAt: '2024-01-25T00:00:00.000Z',
      userId: 'demo-user-1'
    },
    {
      id: 'member-3',
      name: 'Laura Martínez',
      email: 'laura@freelancerpro.com',
      role: 'Community Manager',
      status: 'inactive',
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-15T00:00:00.000Z',
      userId: 'demo-user-1'
    }
  ]
};
