import apiClient from './api';
import { Marca, CreateMarcaRequest, UpdateMarcaRequest, MarcasResponse, MarcaResponse } from '@/types/marca';

export const marcasService = {
  getAll: async (search?: string, activo?: boolean): Promise<Marca[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (activo !== undefined) params.append('activo', activo.toString());
    
    const response = await apiClient.get<MarcasResponse>(`/marcas?${params.toString()}`);
    console.log('marcasService.getAll response:', response.data);
    
    // Asegurar que siempre devolvemos un array
    if (!response.data) return [];
    if (Array.isArray(response.data)) return response.data;
    if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
    
    return [];
  },

  getById: async (id: number): Promise<Marca> => {
    const response = await apiClient.get<MarcaResponse>(`/marcas/${id}`);
    return response.data.data;
  },

  create: async (data: CreateMarcaRequest): Promise<Marca> => {
    const response = await apiClient.post<MarcaResponse>(`/marcas`, data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateMarcaRequest): Promise<Marca> => {
    const response = await apiClient.put<MarcaResponse>(`/marcas/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/marcas/${id}`);
  },

  importarExcel: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<any>('/marcas/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
