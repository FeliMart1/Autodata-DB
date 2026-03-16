import apiClient from './api';

export interface Familia {
  FamiliaID: number;
  MarcaID: number;
  Marca: string;
  Nombre: string;
  Descripcion?: string;
  Activo: boolean;
  FechaCreacion: string;
  FechaModificacion?: string;
  CantidadModelos?: number;
}

export interface FamiliasResponse {
  success: boolean;
  data: Familia[];
  count: number;
}

export interface FamiliaResponse {
  success: boolean;
  data: Familia;
}

export interface CreateFamiliaRequest {
  marcaId: number;
  nombre: string;
  descripcion?: string;
}

export interface UpdateFamiliaRequest {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

/**
 * Obtener todas las familias (opcionalmente filtradas por marca)
 */
export const obtenerFamilias = async (marcaId?: number): Promise<Familia[]> => {
  const params = marcaId ? { marcaId } : {};
  const response = await apiClient.get<FamiliasResponse>('/familias', { params });
  return response.data.data;
};

/**
 * Obtener una familia por ID
 */
export const obtenerFamiliaPorId = async (id: number): Promise<Familia> => {
  const response = await apiClient.get<FamiliaResponse>(`/familias/${id}`);
  return response.data.data;
};

/**
 * Crear una nueva familia
 */
export const crearFamilia = async (data: CreateFamiliaRequest): Promise<number> => {
  const response = await apiClient.post<{ success: boolean; data: { familiaId: number } }>('/familias', data);
  return response.data.data.familiaId;
};

/**
 * Actualizar una familia existente
 */
export const actualizarFamilia = async (id: number, data: UpdateFamiliaRequest): Promise<void> => {
  await apiClient.put(`/familias/${id}`, data);
};

/**
 * Eliminar (desactivar) una familia
 */
export const eliminarFamilia = async (id: number): Promise<void> => {
  await apiClient.delete(`/familias/${id}`);
};

export const familiasService = {
  obtenerFamilias,
  obtenerFamiliaPorId,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia
};

export default familiasService;
