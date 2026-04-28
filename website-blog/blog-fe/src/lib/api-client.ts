import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? '/memorizz-api'
  : (process.env.NEXT_PUBLIC_API_URL || 'https://memorizz-api.onrender.com/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Avoid logging token warnings for public auth routes
    const isPublicAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isPublicAuthRoute) {
      // console.warn(`[API Request] NO TOKEN found for ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error info for debugging
    if (error.response) {
      console.error('❌ API Error Details');
      console.error('URL:', error.config?.url);
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login or clear token)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // window.location.href = '/signin'; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
