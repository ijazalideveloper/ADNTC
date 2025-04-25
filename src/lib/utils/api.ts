import { ApiResponse } from "@/lib/types";

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
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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
