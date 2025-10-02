import { AppData, User, Client, Project, Task, Quote, Contract, TeamMember } from './types';
import { demoData } from './demoData';

const STORAGE_KEY = 'freelancer_app_data';

// Datos iniciales por defecto
const defaultData: AppData = {
  users: [],
  clients: [],
  projects: [],
  tasks: [],
  quotes: [],
  contracts: [],
  teamMembers: []
};

// Función para generar IDs únicos
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Función para obtener la fecha actual en formato ISO
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

// Funciones de almacenamiento
export const loadData = (): AppData => {
  if (typeof window === 'undefined') return defaultData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error('Error loading data:', error);
    return defaultData;
  }
};

export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Funciones CRUD para Users
export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const data = loadData();
  const user: User = {
    ...userData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.users.push(user);
  saveData(data);
  return user;
};

export const getUserByEmail = (email: string): User | undefined => {
  const data = loadData();
  return data.users.find(user => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  const data = loadData();
  return data.users.find(user => user.id === id);
};

// Funciones CRUD para Clients
export const createClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
  const data = loadData();
  const client: Client = {
    ...clientData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.clients.push(client);
  saveData(data);
  return client;
};

export const getClientsByUserId = (userId: string): Client[] => {
  const data = loadData();
  return data.clients.filter(client => client.userId === userId);
};

export const updateClient = (id: string, updates: Partial<Client>): Client | null => {
  const data = loadData();
  const index = data.clients.findIndex(client => client.id === id);
  
  if (index === -1) return null;
  
  data.clients[index] = {
    ...data.clients[index],
    ...updates,
    updatedAt: getCurrentDate()
  };
  
  saveData(data);
  return data.clients[index];
};

export const deleteClient = (id: string): boolean => {
  const data = loadData();
  const index = data.clients.findIndex(client => client.id === id);
  
  if (index === -1) return false;
  
  data.clients.splice(index, 1);
  saveData(data);
  return true;
};

// Funciones CRUD para Projects
export const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
  const data = loadData();
  const project: Project = {
    ...projectData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.projects.push(project);
  saveData(data);
  return project;
};

export const getProjectsByUserId = (userId: string): Project[] => {
  const data = loadData();
  return data.projects.filter(project => project.userId === userId);
};

export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  const data = loadData();
  const index = data.projects.findIndex(project => project.id === id);
  
  if (index === -1) return null;
  
  data.projects[index] = {
    ...data.projects[index],
    ...updates,
    updatedAt: getCurrentDate()
  };
  
  saveData(data);
  return data.projects[index];
};

// Funciones CRUD para Tasks
export const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const data = loadData();
  const task: Task = {
    ...taskData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.tasks.push(task);
  saveData(data);
  return task;
};

export const getTasksByUserId = (userId: string): Task[] => {
  const data = loadData();
  return data.tasks.filter(task => task.userId === userId);
};

export const getTasksByProjectId = (projectId: string): Task[] => {
  const data = loadData();
  return data.tasks.filter(task => task.projectId === projectId);
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const data = loadData();
  const index = data.tasks.findIndex(task => task.id === id);
  
  if (index === -1) return null;
  
  data.tasks[index] = {
    ...data.tasks[index],
    ...updates,
    updatedAt: getCurrentDate()
  };
  
  saveData(data);
  return data.tasks[index];
};

// Funciones CRUD para Quotes
export const createQuote = (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Quote => {
  const data = loadData();
  const quote: Quote = {
    ...quoteData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.quotes.push(quote);
  saveData(data);
  return quote;
};

export const getQuotesByUserId = (userId: string): Quote[] => {
  const data = loadData();
  return data.quotes.filter(quote => quote.userId === userId);
};

// Funciones CRUD para Contracts
export const createContract = (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Contract => {
  const data = loadData();
  const contract: Contract = {
    ...contractData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.contracts.push(contract);
  saveData(data);
  return contract;
};

export const getContractsByUserId = (userId: string): Contract[] => {
  const data = loadData();
  return data.contracts.filter(contract => contract.userId === userId);
};

// Funciones CRUD para TeamMembers
export const createTeamMember = (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): TeamMember => {
  const data = loadData();
  const member: TeamMember = {
    ...memberData,
    id: generateId(),
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  };
  
  data.teamMembers.push(member);
  saveData(data);
  return member;
};

export const getTeamMembersByUserId = (userId: string): TeamMember[] => {
  const data = loadData();
  return data.teamMembers.filter(member => member.userId === userId);
};

export const updateTeamMember = (id: string, updates: Partial<TeamMember>): TeamMember | null => {
  const data = loadData();
  const index = data.teamMembers.findIndex(member => member.id === id);
  
  if (index === -1) return null;
  
  data.teamMembers[index] = {
    ...data.teamMembers[index],
    ...updates,
    updatedAt: getCurrentDate()
  };
  
  saveData(data);
  return data.teamMembers[index];
};

export const deleteTeamMember = (id: string): boolean => {
  const data = loadData();
  const index = data.teamMembers.findIndex(member => member.id === id);
  
  if (index === -1) return false;
  
  data.teamMembers.splice(index, 1);
  saveData(data);
  return true;
};

export const updateQuote = (id: string, updates: Partial<Quote>): Quote | null => {
  const data = loadData();
  const index = data.quotes.findIndex(quote => quote.id === id);
  
  if (index === -1) return null;
  
  data.quotes[index] = {
    ...data.quotes[index],
    ...updates,
    updatedAt: getCurrentDate()
  };
  
  saveData(data);
  return data.quotes[index];
};

export const updateContract = (id: string, updates: Partial<Contract>): Contract | null => {
  const data = loadData();
  const index = data.contracts.findIndex(contract => contract.id === id);
  
  if (index === -1) return null;
  
  data.contracts[index] = {
    ...data.contracts[index],
    ...updates,
    updatedAt: getCurrentDate()
  };
  
  saveData(data);
  return data.contracts[index];
};

// Función para cargar datos de demostración
export const loadDemoData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    localStorage.setItem('current_user', JSON.stringify({
      ...demoData.users[0],
      password: '' // No devolver la contraseña
    }));
  } catch (error) {
    console.error('Error loading demo data:', error);
  }
};

// Función para verificar si hay datos
export const hasData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  
  try {
    const data = JSON.parse(stored);
    return data.users && data.users.length > 0;
  } catch {
    return false;
  }
};
