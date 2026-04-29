import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const API_BASE_URL = '/memorizz-api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Avoid logging token warnings for public auth routes
    const isPublicAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    // Get token from store first, fallback to localStorage
    let token = useAuthStore.getState().token;
    
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (!isPublicAuthRoute) {
      console.warn(`[API Request] NO TOKEN found for ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isPublicAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');

    // Log detailed error info for debugging
    if (error.response) {
      console.error(`❌ API Error [${status}] on ${url}`);
      console.error('Data:', error.response.data);
    }

    if (status === 401 && !isPublicAuthRoute) {
      console.error('🚨 Session expired or unauthorized. Clearing session...');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear zustand store
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
