import apiClient from './axios';

// ===== ENUMS =====

export enum EstadoGarantia {
  RECIBIDO = 'RECIBIDO',
  EN_REVISION = 'EN_REVISION',
  PENDIENTE_DECISION = 'PENDIENTE_DECISION',
  EN_REPARACION = 'EN_REPARACION',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export enum DestinoGarantia {
  REINTEGRO = 'REINTEGRO',
  REPARACION = 'REPARACION',
  ELIMINACION = 'ELIMINACION'
}

export enum EstadoFisico {
  BUENO = 'BUENO',
  DANIADO = 'DANIADO',
  NO_RECUPERABLE = 'NO_RECUPERABLE'
}

export enum ResultadoInspeccion {
  REPARABLE = 'REPARABLE',
  NO_REPARABLE = 'NO_REPARABLE',
  APTO_REINTEGRO = 'APTO_REINTEGRO'
}

// ===== INTERFACES - REQUEST DTOs =====

/** POST /garantias - Registrar nueva garantía */
export interface RegistrarGarantiaDTO {
  idDevolucion: number;
  motivo: string;
  items: {
    idProducto: number;
    cantidad: number;
    lote?: string;
  }[];
}

/** POST /garantias/{idGarantia}/inspeccion - Registrar resultado de inspección */
export interface RegistrarInspeccionDTO {
  inspectorId: number;
  observaciones: string;
  items: {
    idItemGarantia: number;
    estadoFisico: EstadoFisico;
    resultadoInspeccion: ResultadoInspeccion;
  }[];
}

/** POST /garantias/{idGarantia}/decision - Confirmar decisión final */
export interface ConfirmarDecisionDTO {
  destino: DestinoGarantia;
  usuarioResponsableId: number;
  comentario?: string;
}

/** GET /garantias - Parámetros de consulta */
export interface ListarGarantiasParams {
  estado?: EstadoGarantia;
  destino?: DestinoGarantia;
  page?: number;
  limit?: number;
}

// ===== INTERFACES - RESPONSE =====

export interface ItemGarantia {
  idItemGarantia: number;
  idProducto: number;
  productoNombre?: string;
  productoCodigo?: string;
  cantidad: number;
  lote?: string;
  estadoFisico?: EstadoFisico;
  resultadoInspeccion?: ResultadoInspeccion;
}

export interface Garantia {
  idGarantia: number;
  idDevolucion: number;
  motivo: string;
  estado: EstadoGarantia;
  destino?: DestinoGarantia;
  fechaRegistro: string;
  fechaInspeccion?: string;
  fechaDecision?: string;
  inspectorId?: number;
  inspectorNombre?: string;
  usuarioResponsableId?: number;
  observaciones?: string;
  comentarioDecision?: string;
  items: ItemGarantia[];
}

export interface GarantiaListResponse {
  items: Garantia[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===== API PRINCIPAL (según tu diseño en Apidog) =====

export const garantiasAPIv2 = {
  /**
   * POST /garantias
   * Registrar una nueva garantía
   */
  registrar: async (data: RegistrarGarantiaDTO): Promise<Garantia> => {
    const response = await apiClient.post('/garantias', data);
    return response.data;
  },

  /**
   * GET /garantias/{idGarantia}
   * Obtener detalle de una garantía
   */
  obtenerDetalle: async (idGarantia: number): Promise<Garantia> => {
    const response = await apiClient.get(`/garantias/${idGarantia}`);
    return response.data;
  },

  /**
   * POST /garantias/{idGarantia}/inspeccion
   * Registrar resultado de inspección
   */
  registrarInspeccion: async (idGarantia: number, data: RegistrarInspeccionDTO): Promise<Garantia> => {
    const response = await apiClient.post(`/garantias/${idGarantia}/inspeccion`, data);
    return response.data;
  },

  /**
   * POST /garantias/{idGarantia}/decision
   * Confirmar decisión final (reintegro, reparación o eliminación)
   */
  confirmarDecision: async (idGarantia: number, data: ConfirmarDecisionDTO): Promise<Garantia> => {
    const response = await apiClient.post(`/garantias/${idGarantia}/decision`, data);
    return response.data;
  },

  /**
   * GET /garantias
   * Listar garantías con filtros
   */
  listar: async (params?: ListarGarantiasParams): Promise<GarantiaListResponse> => {
    const response = await apiClient.get('/garantias', { params });
    return response.data;
  },
};


// ===== TIPOS LEGACY (para compatibilidad con páginas existentes) =====

export const EstadoDevolucion = EstadoGarantia;
export type EstadoDevolucion = EstadoGarantia;

export const DestinoDevolucion = DestinoGarantia;
export type DestinoDevolucion = DestinoGarantia;

export const EstadoItem = {
  PENDIENTE: 'PENDIENTE' as const,
  INSPECCIONADO: 'INSPECCIONADO' as const,
  REINTEGRADO: 'REINTEGRADO' as const,
  EN_REPARACION: 'EN_REPARACION' as const,
  ELIMINADO: 'ELIMINADO' as const,
};

export interface ItemDevolucion {
  itemId: string;
  materialId: string;
  materialCodigo?: string;
  materialNombre?: string;
  cantidad: number;
  motivo: string;
  observaciones?: string;
  estado: string;
  destino?: DestinoGarantia;
  fechaInspeccion?: string;
  resultadoInspeccion?: string;
}

export interface Devolucion {
  devolucionId: string;
  codigo: string;
  fechaRegistro: string;
  fechaActualizacion?: string;
  estado: EstadoGarantia;
  clienteNombre?: string;
  clienteDocumento?: string;
  motivoGeneral: string;
  observaciones?: string;
  items: ItemDevolucion[];
  usuarioRegistro?: string;
  usuarioActualizacion?: string;
}

export interface DevolucionCreateDTO {
  clienteNombre?: string;
  clienteDocumento?: string;
  motivoGeneral: string;
  observaciones?: string;
  items: {
    materialId: string;
    cantidad: number;
    motivo: string;
    observaciones?: string;
  }[];
}

export interface InspeccionItemDTO {
  itemId: string;
  resultado: 'APTO' | 'DAÑADO' | 'NO_RECUPERABLE';
  observaciones?: string;
  destino: DestinoGarantia;
}

export interface ProcesarDevolucionDTO {
  devolucionId: string;
  items: InspeccionItemDTO[];
}

export interface HistorialMovimiento {
  movimientoId: string;
  devolucionId: string;
  devolucionCodigo?: string;
  itemId?: string;
  materialId?: string;
  materialNombre?: string;
  tipo: 'REGISTRO' | 'INSPECCION' | 'REINTEGRO' | 'REPARACION' | 'ELIMINACION' | 'COMPLETAR';
  cantidad?: number;
  descripcion: string;
  usuario: string;
  fecha: string;
}

export interface DevolucionListResponse {
  items: Devolucion[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HistorialListResponse {
  items: HistorialMovimiento[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Legacy para compatibilidad con las páginas actuales
export const garantiasAPI = {
  listarDevoluciones: async (params?: {
    page?: number;
    limit?: number;
    estado?: EstadoGarantia;
    search?: string;
  }): Promise<DevolucionListResponse> => {
    const response = await apiClient.get('/garantias', { params });
    return response.data;
  },

  obtenerDevolucion: async (id: string): Promise<Devolucion> => {
    const response = await apiClient.get(`/garantias/${id}`);
    return response.data;
  },

  registrarDevolucion: async (data: DevolucionCreateDTO): Promise<Devolucion> => {
    const response = await apiClient.post('/garantias', data);
    return response.data;
  },

  procesarDevolucion: async (data: ProcesarDevolucionDTO): Promise<Devolucion> => {
    const response = await apiClient.post(`/garantias/${data.devolucionId}/decision`, data);
    return response.data;
  },

  listarEnReparacion: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<DevolucionListResponse> => {
    const response = await apiClient.get('/garantias', { 
      params: { ...params, destino: 'REPARACION' } 
    });
    return response.data;
  },

  completarReparacion: async (devolucionId: string, _itemId: string, resultado: string): Promise<void> => {
    await apiClient.post(`/garantias/${devolucionId}/decision`, { destino: resultado });
  },

  listarHistorial: async (params?: {
    page?: number;
    limit?: number;
    tipo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<HistorialListResponse> => {
    const response = await apiClient.get('/garantias/logs', { params });
    return response.data;
  },
};
