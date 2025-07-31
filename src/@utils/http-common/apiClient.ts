import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { URI, Namespace } from "../enums/enum";

const apiUri = String(URI.API_URI);

const apiClient = axios.create({
  baseURL: apiUri,
  withCredentials: true,
});

const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;

    // Add 30-second buffer to prevent edge cases
    return Date.now() >= exp * 1000 - 30000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

const removeTokensAndReload = () => {
  localStorage.removeItem(Namespace.BASE);
  Cookies.remove(Namespace.BASE);

  // Clear any other app-specific data
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");

  // Redirect to login instead of reload to prevent infinite loops
  window.location.href = "/login";
};

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedRequestsQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedRequestsQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = Cookies.get(Namespace.BASE);
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const response = await axios.post(
      `${apiUri}/api/v1/auth/refresh`,
      { refreshToken },
      {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      }
    );

    const { accessToken } = response.data;
    if (!accessToken) {
      throw new Error("No access token received");
    }

    localStorage.setItem(Namespace.BASE, accessToken);
    return accessToken;
  } catch (error) {
    // If refresh fails, the refresh token might be expired or invalid
    console.error("Token refresh failed:", error);
    throw error;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem(Namespace.BASE);

    // Check if we need a new access token
    if (!accessToken || isTokenExpired(accessToken)) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            },
            reject: (error: Error) => {
              reject(error);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        accessToken = await refreshAccessToken();
        processQueue(null, accessToken);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        removeTokensAndReload();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (error: Error) => {
              reject(error);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const accessToken = await refreshAccessToken();
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        removeTokensAndReload();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error cases
    if (error.response?.status === 403) {
      console.error("Forbidden: Insufficient permissions");
      // You might want to redirect to a "no permission" page
    }

    return Promise.reject(error);
  }
);

// Utility functions for token management
export const tokenUtils = {
  // Get current user info from access token
  getCurrentUser: (): Record<string, unknown> | null => {
    const token = localStorage.getItem(Namespace.BASE);
    if (!token || isTokenExpired(token)) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(Namespace.BASE);
    const refreshToken = Cookies.get(Namespace.BASE);
    return !!(token && refreshToken && !isTokenExpired(token));
  },

  // Manual logout function
  logout: async (): Promise<void> => {
    try {
      const refreshToken = Cookies.get(Namespace.BASE);
      if (refreshToken) {
        await apiClient.post("/api/v1/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      removeTokensAndReload();
    }
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    try {
      await apiClient.post("/api/v1/auth/logout-all");
    } catch (error) {
      console.error("Logout all API call failed:", error);
    } finally {
      removeTokensAndReload();
    }
  },

  // Get active sessions
  getActiveSessions: async (): Promise<
    Array<{ id: string; createdAt: string; lastUsedAt: string }>
  > => {
    try {
      const response = await apiClient.get("/api/v1/auth/sessions");
      return response.data.sessions;
    } catch (error) {
      console.error("Failed to get active sessions:", error);
      return [];
    }
  },

  // Revoke a specific session
  revokeSession: async (sessionId: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/auth/sessions/${sessionId}`);
      return true;
    } catch (error) {
      console.error("Failed to revoke session:", error);
      return false;
    }
  },
};

export default apiClient;
