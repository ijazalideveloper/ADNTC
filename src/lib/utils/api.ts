import { ApiResponse, User, Task } from "@/lib/types";

const API_BASE_URL = "/api";

/**
 * Generic API request function
 */
async function apiRequest<T = any>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add auth token to headers if available
    let token = null;

    // Use localStorage only in browser environment
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Parse the JSON response
    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Something went wrong",
      };
    }

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error("API request error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * API methods for different HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint, "GET"),
  post: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, "POST", data),
  put: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, "PUT", data),
  patch: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, "PATCH", data),
  delete: <T = any>(endpoint: string) => apiRequest<T>(endpoint, "DELETE"),
};

/**
 * Authentication API methods
 */
export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post<{ user: User; token: string }>(
      "/auth/login",
      { email, password }
    );
    if (
      response.success &&
      response.data?.token &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post<{ user: User; token: string }>(
      "/auth/signup",
      { name, email, password, confirmPassword }
    );
    if (
      response.success &&
      response.data?.token &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    return await api.get<{ user: User }>("/auth/me");
  },
};

/**
 * Tasks API methods
 */
export const tasksApi = {
  getAllTasks: async (filters?: {
    status?: string;
    priority?: string;
    sortBy?: string;
  }): Promise<ApiResponse<{ tasks: Task[] }>> => {
    let endpoint = "/tasks";

    if (filters) {
      const params = new URLSearchParams();

      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }

      if (filters.priority && filters.priority !== "all") {
        params.append("priority", filters.priority);
      }

      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }

    return await api.get<{ tasks: Task[] }>(endpoint);
  },

  getTaskById: async (taskId: string): Promise<ApiResponse<{ task: Task }>> => {
    return await api.get<{ task: Task }>(`/tasks/${taskId}`);
  },

  createTask: async (taskData: {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
  }): Promise<ApiResponse<{ task: Task }>> => {
    return await api.post<{ task: Task }>("/tasks", taskData);
  },

  updateTask: async (
    taskId: string,
    taskData: {
      title: string;
      description?: string;
      priority?: string;
      status?: string;
    }
  ): Promise<ApiResponse<{ task: Task }>> => {
    return await api.put<{ task: Task }>(`/tasks/${taskId}`, taskData);
  },

  updateTaskStatus: async (
    taskId: string,
    status: string
  ): Promise<ApiResponse<{ task: Task }>> => {
    return await api.patch<{ task: Task }>(`/tasks/${taskId}`, { status });
  },

  deleteTask: async (
    taskId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    return await api.delete<{ message: string }>(`/tasks/${taskId}`);
  },
};
