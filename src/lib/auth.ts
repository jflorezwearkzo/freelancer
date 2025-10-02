import bcrypt from 'bcryptjs';
import { User } from './types';
import { createUser, getUserByEmail } from './storage';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResult> => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error: 'El usuario ya existe'
      };
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = createUser({
      email,
      password: hashedPassword,
      name,
      role: 'freelancer'
    });

    return {
      success: true,
      user: {
        ...user,
        password: '' // No devolver la contraseña
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al registrar usuario'
    };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const user = getUserByEmail(email);
    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Contraseña incorrecta'
      };
    }

    return {
      success: true,
      user: {
        ...user,
        password: '' // No devolver la contraseña
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al iniciar sesión'
    };
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('current_user');
  }
};

export const logout = (): void => {
  setCurrentUser(null);
};
