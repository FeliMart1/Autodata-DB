// departamentosService.ts
// Servicio para operaciones de departamentos

import api from './api';
import type { DepartamentosResponse, Departamento } from '../types/ventas.types';

const DEPARTAMENTOS_BASE_URL = '/departamentos';

/**
 * Obtener todos los departamentos activos
 */
export const obtenerDepartamentos = async (): Promise<DepartamentosResponse> => {
  const response = await api.get<DepartamentosResponse>(DEPARTAMENTOS_BASE_URL);
  return response.data;
};

/**
 * Obtener un departamento por ID
 */
export const obtenerDepartamentoPorId = async (id: number): Promise<{ success: boolean; data: Departamento }> => {
  const response = await api.get<{ success: boolean; data: Departamento }>(
    `${DEPARTAMENTOS_BASE_URL}/${id}`
  );
  return response.data;
};

export default {
  obtenerDepartamentos,
  obtenerDepartamentoPorId
};
