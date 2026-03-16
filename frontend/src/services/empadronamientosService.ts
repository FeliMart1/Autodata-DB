// empadronamientosService.ts
// Servicio para operaciones de empadronamientos

import api from './api';
import type {
  EmpadronamientosResponse,
  EmpadronamientosPeriodoAnteriorResponse,
  EmpadronamientoBatchRequest,
  BatchSaveResponse,
  ResumenEmpadronamientosResponse,
  HistorialEmpadronamientosResponse
} from '../types/ventas.types';

const EMPADRONAMIENTOS_BASE_URL = '/empadronamientos';

/**
 * Obtener empadronamientos por familia, departamento y periodo
 */
export const obtenerEmpadronamientosPorFamilia = async (
  familiaId: number,
  departamentoId: number,
  periodo: string
): Promise<EmpadronamientosResponse> => {
  const response = await api.get<EmpadronamientosResponse>(
    `${EMPADRONAMIENTOS_BASE_URL}/familia`,
    {
      params: { familiaId, departamentoId, periodo }
    }
  );
  return response.data;
};

/**
 * Obtener empadronamientos del periodo anterior
 */
export const obtenerEmpadronamientosPeriodoAnterior = async (
  familiaId: number,
  departamentoId: number,
  periodo: string
): Promise<EmpadronamientosPeriodoAnteriorResponse> => {
  const response = await api.get<EmpadronamientosPeriodoAnteriorResponse>(
    `${EMPADRONAMIENTOS_BASE_URL}/periodo-anterior`,
    {
      params: { familiaId, departamentoId, periodo }
    }
  );
  return response.data;
};

/**
 * Guardar empadronamientos en batch
 */
export const guardarEmpadronamientosBatch = async (
  data: EmpadronamientoBatchRequest
): Promise<BatchSaveResponse> => {
  const response = await api.post<BatchSaveResponse>(
    `${EMPADRONAMIENTOS_BASE_URL}/crear-batch`,
    data
  );
  return response.data;
};

/**
 * Obtener resumen de empadronamientos
 */
export const obtenerResumenEmpadronamientos = async (
  periodo: string,
  departamentoId?: number
): Promise<ResumenEmpadronamientosResponse> => {
  const response = await api.get<ResumenEmpadronamientosResponse>(
    `${EMPADRONAMIENTOS_BASE_URL}/resumen`,
    {
      params: { periodo, departamentoId }
    }
  );
  return response.data;
};

/**
 * Obtener historial de empadronamientos de un modelo en un departamento
 */
export const obtenerHistorialEmpadronamientosModelo = async (
  modeloId: number,
  departamentoId: number,
  limit: number = 12
): Promise<HistorialEmpadronamientosResponse> => {
  const response = await api.get<HistorialEmpadronamientosResponse>(
    `${EMPADRONAMIENTOS_BASE_URL}/modelo/${modeloId}/departamento/${departamentoId}/historial`,
    {
      params: { limit }
    }
  );
  return response.data;
};

export default {
  obtenerEmpadronamientosPorFamilia,
  obtenerEmpadronamientosPeriodoAnterior,
  guardarEmpadronamientosBatch,
  obtenerResumenEmpadronamientos,
  obtenerHistorialEmpadronamientosModelo
};
