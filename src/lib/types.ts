export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'freelancer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'prospect' | 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  budget?: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clientId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  projectId?: string;
  assigneeId?: string;
}

export interface Quote {
  id: string;
  title: string;
  description?: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clientId: string;
  projectId?: string;
}

export interface Contract {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  signedDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clientId: string;
  projectId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AppData {
  users: User[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  quotes: Quote[];
  contracts: Contract[];
  teamMembers: TeamMember[];
}
