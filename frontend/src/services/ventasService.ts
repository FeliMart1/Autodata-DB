// ventasService.ts
// Servicio para operaciones de ventas

import api from './api';
import type {
  VentasResponse,
  VentasPeriodoAnteriorResponse,
  VentaBatchRequest,
  BatchSaveResponse,
  ResumenVentasResponse,
  HistorialVentasResponse
} from '../types/ventas.types';

const VENTAS_BASE_URL = '/ventas';

/**
 * Obtener ventas por familia y periodo
 */
export const obtenerVentasPorFamilia = async (
  familiaId: number,
  periodo: string
): Promise<VentasResponse> => {
  const response = await api.get<VentasResponse>(`${VENTAS_BASE_URL}/familia`, {
    params: { familiaId, periodo }
  });
  return response.data;
};

/**
 * Obtener ventas del periodo anterior (para referencia)
 */
export const obtenerVentasPeriodoAnterior = async (
  familiaId: number,
  periodo: string
): Promise<VentasPeriodoAnteriorResponse> => {
  const response = await api.get<VentasPeriodoAnteriorResponse>(
    `${VENTAS_BASE_URL}/periodo-anterior`,
    {
      params: { familiaId, periodo }
    }
  );
  return response.data;
};

/**
 * Guardar ventas en batch (crear o actualizar múltiples ventas)
 */
export const guardarVentasBatch = async (
  data: VentaBatchRequest
): Promise<BatchSaveResponse> => {
  const response = await api.post<BatchSaveResponse>(
    `${VENTAS_BASE_URL}/crear-batch`,
    data
  );
  return response.data;
};

/**
 * Obtener resumen de ventas por periodo
 */
export const obtenerResumenVentas = async (
  periodo: string
): Promise<ResumenVentasResponse> => {
  const response = await api.get<ResumenVentasResponse>(`${VENTAS_BASE_URL}/resumen`, {
    params: { periodo }
  });
  return response.data;
};

/**
 * Obtener historial de ventas de un modelo
 */
export const obtenerHistorialVentasModelo = async (
  modeloId: number,
  limit: number = 12
): Promise<HistorialVentasResponse> => {
  const response = await api.get<HistorialVentasResponse>(
    `${VENTAS_BASE_URL}/modelo/${modeloId}/historial`,
    {
      params: { limit }
    }
  );
  return response.data;
};

export default {
  obtenerVentasPorFamilia,
  obtenerVentasPeriodoAnterior,
  guardarVentasBatch,
  obtenerResumenVentas,
  obtenerHistorialVentasModelo
};

