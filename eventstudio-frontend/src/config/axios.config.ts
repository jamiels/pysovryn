import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { getAuth, setAuth, removeAuth, AuthModel, UserModel } from '@/auth'; // Ensure clearAuth logs out the user
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
const MAX_REFRESH_TRIES = 3;
let refreshAttempts = 0; // Track refresh retries

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to refresh the access token
const refreshToken = async (): Promise<string | null> => {
  if (refreshAttempts >= MAX_REFRESH_TRIES) {
    console.error('Max token refresh attempts reached. Logging out user.');
    removeAuth(); // Remove tokens and log out the user
    showToast('error', 'Session expired. Please log in again.');
    return null;
  }

  try {
    const refreshToken = getAuth()?.refreshToken;
    if (!refreshToken) return null;

    refreshAttempts++;

    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

    const newAccessToken = response.data.accessToken;

    // Reset retry counter on successful refresh
    refreshAttempts = 0;

    const updatedAuth: AuthModel = {
      user: getAuth()?.user as UserModel,
      accessToken: newAccessToken as string,
      refreshToken: refreshToken as string
    };

    // Update stored authentication data
    setAuth(updatedAuth);

    // Notify all subscribers that the token has been refreshed
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];

    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

// Add Authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const authToken = getAuth()?.accessToken;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Handles Token Expiry and Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`
            };
            resolve(apiClient(originalRequest)); // Retry request with new token
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshToken();
      isRefreshing = false;

      if (newToken) {
        // Retry the original request with the new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`
        };
        return apiClient(originalRequest);
      } else {
        removeAuth();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
