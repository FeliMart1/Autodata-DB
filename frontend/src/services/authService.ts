import apiClient from './api';
import { LoginRequest, LoginResponse, User } from '@types/index';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<any>('/auth/login', credentials);
    // El backend devuelve { success, message, token, user }
    return {
      token: response.data.token,
      user: response.data.user
    };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<any>('/auth/me');
    // El backend devuelve { success, data }
    return response.data.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },
};
