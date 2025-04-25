// User type
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

// Task types
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
