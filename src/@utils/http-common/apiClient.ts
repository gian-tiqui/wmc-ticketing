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

  const { exp } = jwtDecode(token);

  if (!exp) throw new Error("Token does not have a valid exp");
  if (Date.now() >= exp * 1000) {
    return true;
  }

  return false;
};

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem(Namespace.BASE);

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        const refreshToken = Cookies.get(Namespace.BASE);

        const response = await axios.post(
          `${apiUri}/api/v1/auth/refresh`,
          { refreshToken },
          {
            withCredentials: true,
          }
        );

        accessToken = response.data.accessToken;

        if (!accessToken || accessToken === undefined) {
          Cookies.remove(Namespace.BASE);
          localStorage.removeItem(Namespace.BASE);

          throw new Error("No token was generated");
        }

        try {
          localStorage.setItem(Namespace.BASE, accessToken);
        } catch (error) {
          console.error(error);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
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

      try {
        const refreshToken = Cookies.get(Namespace.BASE);
        const response = await axios.post(
          `${apiUri}api/v1/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem(Namespace.BASE, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
