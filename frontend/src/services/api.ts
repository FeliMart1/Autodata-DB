import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Flag para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Función interna de refresh token (evita importación circular)
const refreshTokenInternal = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<any>(`${API_URL}/auth/refresh`, { refreshToken });
  
  // Guardar nuevos tokens
  const newToken = response.data.token;
  const newRefreshToken = response.data.refreshToken;
  
  localStorage.setItem('token', newToken);
  if (newRefreshToken) {
    localStorage.setItem('refreshToken', newRefreshToken);
  }
  
  return newToken;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor con manejo de refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Si es un error 401 y no es el endpoint de login o refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData: any = error.response.data;
      
      // Si el código indica que el token expiró y tenemos refresh token
      if (errorData?.code === 'TOKEN_EXPIRED' && localStorage.getItem('refreshToken')) {
        
        if (isRefreshing) {
          // Si ya se está refrescando, agregar a la cola
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Intentar refrescar el token
          const newToken = await refreshTokenInternal();
          
          // Actualizar el header de la petición original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Procesar cola de peticiones pendientes
          processQueue(null, newToken);
          
          isRefreshing = false;
          
          // Reintentar la petición original
          return apiClient(originalRequest);
          
        } catch (refreshError) {
          // Si falla el refresh, limpiar todo y redirigir al login
          processQueue(refreshError, null);
          isRefreshing = false;
          
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          
          return Promise.reject(refreshError);
        }
      } else {
        // Si no hay refresh token o es otro tipo de 401, redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
