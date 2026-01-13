import apiClient from './api';
import { Marca } from '@types/index';

export const marcaService = {
  getAll: async (): Promise<Marca[]> => {
    const response = await apiClient.get<Marca[]>('/marcas');
    return response.data;
  },

  getById: async (id: number): Promise<Marca> => {
    const response = await apiClient.get<Marca>(`/marcas/${id}`);
    return response.data;
  },

  create: async (data: { marca: string; pais_origen?: string }): Promise<Marca> => {
    const response = await apiClient.post<Marca>('/marcas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Marca>): Promise<Marca> => {
    const response = await apiClient.put<Marca>(`/marcas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/marcas/${id}`);
  },
};
