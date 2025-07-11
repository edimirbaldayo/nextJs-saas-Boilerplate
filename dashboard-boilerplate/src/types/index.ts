// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: Date;
  bio?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  preferences?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication types
export interface Session {
  user: User;
  expires: string;
}

// Role and Permission types
export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionTime: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
} 