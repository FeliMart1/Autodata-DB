import apiClient from './api';

export interface PrecioModelo {
  PrecioID: number;
  ModeloID: number;
  Precio: number;
  Moneda: string;
  FechaVigenciaDesde: string;
  FechaVigenciaHasta?: string;
  Fuente?: string;
  FechaCarga?: string;
  DescripcionModelo?: string;
  CodigoAutodata?: string;
  MarcaNombre?: string;
}

export interface CreatePrecioRequest {
  modeloId: number;
  precio: number;
  moneda?: string;
  fechaVigenciaDesde: string;
  fuente?: string;
}

export const precioService = {
  // Obtener todos los precios de un modelo
  getPreciosByModelo: async (modeloId: number): Promise<PrecioModelo[]> => {
    const response = await apiClient.get<{ success: boolean; data: PrecioModelo[] }>(`/precios/modelo/${modeloId}`);
    return response.data.data;
  },

  // Obtener precio actual vigente
  getPrecioActual: async (modeloId: number): Promise<PrecioModelo> => {
    const response = await apiClient.get<{ success: boolean; data: PrecioModelo }>(`/precios/modelo/${modeloId}/actual`);
    return response.data.data;
  },

  // Crear nuevo precio
  createPrecio: async (data: CreatePrecioRequest): Promise<PrecioModelo> => {
    const response = await apiClient.post<{ success: boolean; data: PrecioModelo }>('/precios/modelo', data);
    return response.data.data;
  },

  // Actualizar precio
  updatePrecio: async (precioId: number, data: Partial<PrecioModelo>): Promise<PrecioModelo> => {
    const response = await apiClient.put<{ success: boolean; data: PrecioModelo }>(`/precios/${precioId}`, data);
    return response.data.data;
  },

  // Eliminar precio
  deletePrecio: async (precioId: number): Promise<void> => {
    await apiClient.delete(`/precios/${precioId}`);
  },
};
