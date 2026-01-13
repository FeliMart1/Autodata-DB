import apiClient from './api';
import { VentasModelo } from '@/types/index';

export const ventasService = {
  getByModelo: async (idModelo: number): Promise<VentasModelo[]> => {
    const response = await apiClient.get<VentasModelo[]>(`/ventas/modelo/${idModelo}`);
    return response.data;
  },

  create: async (data: Partial<VentasModelo>): Promise<VentasModelo> => {
    const response = await apiClient.post<VentasModelo>('/ventas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<VentasModelo>): Promise<VentasModelo> => {
    const response = await apiClient.put<VentasModelo>(`/ventas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ventas/${id}`);
  },

  getByPeriodo: async (periodo: string): Promise<VentasModelo[]> => {
    const response = await apiClient.get<VentasModelo[]>(`/ventas/periodo/${periodo}`);
    return response.data;
  },
};
