import axios from 'axios';

const apiClient = axios.create({
  // Use Proxy path in development to bypass CORS issues
  baseURL: process.env.NODE_ENV === 'development'
    ? '/memorizz-api'
    : (process.env.NEXT_PUBLIC_API_URL || 'https://memorizz-api.onrender.com/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('token');

      // Get token from auth-storage if standard token is missing
      if (!token) {
        try {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            token = parsed.state?.token;
          }
        } catch (e) { }
      }

      if (token) {
        // Apply all methods to ensure header is attached properly
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.set('Authorization', `Bearer ${token}`);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`%c[API Request] ${config.method?.toUpperCase()} ${config.url}`, 'color: #10b981; font-weight: bold;');
        }
      } else {
        const isPublicRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        if (process.env.NODE_ENV === 'development' && !isPublicRoute) {
          console.warn(`%c[API Request] NO TOKEN found for ${config.url}`, 'color: #f59e0b; font-weight: bold;');
        }
      }

    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detailed error logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group('❌ API Error Details');
      console.error('URL:', error.config?.url);
      console.error('Status:', error.response?.status || 'NETWORK_ERROR/TIMEOUT');
      console.error('Data:', error.response?.data);
      console.groupEnd();
    }

    if (error.response?.status === 401) {
      const url = error.config?.url;
      const isAuthRoute = url?.includes('/auth/') || url?.includes('/users/');

      if (typeof window !== 'undefined' && !isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        if (!window.location.pathname.includes('/signin')) {
          window.location.href = '/signin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
