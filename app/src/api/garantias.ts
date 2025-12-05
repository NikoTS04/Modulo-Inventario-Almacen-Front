import apiClient from './axios';
import { shouldUseMockData } from '../config/environment';

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
// Variables de estado Mock (en memoria simulan persistencia durante la sesión)
let mockDevolucionesStore: Devolucion[] = [
  {
    devolucionId: 'dev-001',
    codigo: 'DEV-2024-001',
    fechaRegistro: new Date().toISOString(),
    estado: EstadoGarantia.RECIBIDO,
    clienteNombre: 'Juan Pérez',
    clienteDocumento: '12345678',
    motivoGeneral: 'Producto defectuoso',
    items: [
      { itemId: 'item-001', materialId: 'mat-001', materialNombre: 'Samsung Galaxy S24', cantidad: 1, motivo: 'No enciende', estado: 'PENDIENTE' },
      { itemId: 'item-002', materialId: 'mat-002', materialNombre: 'Samsung Galaxy S24 Gris', cantidad: 2, motivo: 'Pantalla dañada', estado: 'PENDIENTE' }
    ]
  },
  {
    devolucionId: 'dev-002',
    codigo: 'DEV-2024-002',
    fechaRegistro: new Date(Date.now() - 86400000).toISOString(),
    estado: EstadoGarantia.RECIBIDO,
    clienteNombre: 'María García',
    motivoGeneral: 'Error en pedido',
    items: [
      { itemId: 'item-003', materialId: 'mat-003', materialNombre: 'iPhone 15 128GB Negro', cantidad: 3, motivo: 'Producto equivocado', estado: 'PENDIENTE' }
    ]
  },
  {
    devolucionId: 'dev-003',
    codigo: 'DEV-2024-003',
    fechaRegistro: new Date(Date.now() - 172800000).toISOString(),
    estado: EstadoGarantia.COMPLETADO,
    clienteNombre: 'Carlos López',
    motivoGeneral: 'Garantía por defecto',
    items: [
      {
        itemId: 'item-004',
        materialId: 'mat-004',
        materialNombre: 'Mouse Inalámbrico',
        cantidad: 2,
        motivo: 'Botón izquierdo no funciona',
        estado: 'EN_REPARACION',
        destino: DestinoGarantia.REPARACION,
        resultadoInspeccion: 'DAÑADO'
      }
    ]
  }
];

const now = () => new Date().toISOString();

// Store para el historial mock
let mockHistorialStore: HistorialMovimiento[] = [
  {
    movimientoId: 'mov-001',
    devolucionId: 'dev-001',
    devolucionCodigo: 'DEV-2024-001',
    tipo: 'REGISTRO',
    descripcion: 'Registro inicial de devolución',
    usuario: 'Juan Pérez',
    fecha: new Date(Date.now() - 3600000).toISOString()
  },
  {
    movimientoId: 'mov-002',
    devolucionId: 'dev-002',
    devolucionCodigo: 'DEV-2024-002',
    tipo: 'REGISTRO',
    descripcion: 'Registro inicial de devolución',
    usuario: 'María García',
    fecha: new Date(Date.now() - 86400000).toISOString()
  },
  {
    movimientoId: 'mov-003',
    devolucionId: 'dev-003',
    devolucionCodigo: 'DEV-2024-003',
    tipo: 'REGISTRO',
    descripcion: 'Registro inicial de devolución',
    usuario: 'Carlos López',
    fecha: new Date(Date.now() - 172800000).toISOString()
  },
  {
    movimientoId: 'mov-004',
    devolucionId: 'dev-003',
    devolucionCodigo: 'DEV-2024-003',
    itemId: 'item-004',
    materialNombre: 'Mouse Inalámbrico',
    tipo: 'INSPECCION',
    cantidad: 2,
    descripcion: 'Inspección: DAÑADO -> REPARACION',
    usuario: 'Inspector Técnico',
    fecha: new Date(Date.now() - 172000000).toISOString()
  },
  {
    movimientoId: 'mov-005',
    devolucionId: 'dev-002',
    devolucionCodigo: 'DEV-2024-002',
    itemId: 'item-003',
    materialNombre: 'iPhone 15 128GB Negro',
    tipo: 'INSPECCION',
    cantidad: 3,
    descripcion: 'Inspección: APTO_REINTEGRO -> REINTEGRO',
    usuario: 'Inspector Técnico',
    fecha: new Date(Date.now() - 85000000).toISOString()
  },
  {
    movimientoId: 'mov-006',
    devolucionId: 'dev-002',
    devolucionCodigo: 'DEV-2024-002',
    itemId: 'item-003',
    materialNombre: 'iPhone 15 128GB Negro',
    tipo: 'REINTEGRO',
    cantidad: 3,
    descripcion: 'Reparación completada: REINTEGRAR',
    usuario: 'Almacén Central',
    fecha: new Date(Date.now() - 84000000).toISOString()
  }
];

const addMockLog = (
  tipo: HistorialMovimiento['tipo'],
  devolucion: Devolucion,
  descripcion: string,
  item?: ItemDevolucion
) => {
  mockHistorialStore.unshift({
    movimientoId: 'mov-' + Date.now() + Math.random(),
    devolucionId: devolucion.devolucionId,
    devolucionCodigo: devolucion.codigo,
    itemId: item?.itemId,
    materialId: item?.materialId,
    materialNombre: item?.materialNombre,
    tipo: tipo,
    cantidad: item?.cantidad,
    descripcion: descripcion,
    usuario: 'Usuario Mock',
    fecha: new Date().toISOString()
  });
};

export const garantiasAPI = {
  listarDevoluciones: async (params?: {
    page?: number;
    limit?: number;
    estado?: EstadoGarantia;
    search?: string;
  }): Promise<DevolucionListResponse> => {
    if (shouldUseMockData()) {
      console.log('📦 Obteniendo lista de devoluciones mock (Store en memoria)');
      let items = [...mockDevolucionesStore];
      if (params?.estado) {
        items = items.filter(d => d.estado === params.estado);
      }
      items.sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());
      return {
        items: items,
        page: 0,
        limit: 100,
        total: items.length,
        totalPages: 1
      };
    }
    const response = await apiClient.get('/garantias', { params });
    return response.data;
  },

  obtenerDevolucion: async (id: string): Promise<Devolucion> => {
    if (shouldUseMockData()) {
      const found = mockDevolucionesStore.find(d => d.devolucionId === id);
      if (found) return found;
    }
    const response = await apiClient.get(`/garantias/${id}`);
    return response.data;
  },

  registrarDevolucion: async (data: DevolucionCreateDTO): Promise<Devolucion> => {
    if (shouldUseMockData()) {
      console.log('📦 Simulando registro de devolución y guardando en memoria:', data);
      await new Promise(resolve => setTimeout(resolve, 800));

      const newDevolucion: Devolucion = {
        devolucionId: 'dev-mock-' + Date.now(),
        codigo: 'DEV-MOCK-' + Math.floor(Math.random() * 1000),
        fechaRegistro: now(),
        estado: EstadoGarantia.RECIBIDO,
        clienteNombre: data.clienteNombre,
        clienteDocumento: data.clienteDocumento,
        motivoGeneral: data.motivoGeneral,
        observaciones: data.observaciones,
        items: data.items.map((i, idx) => ({
          itemId: 'item-' + idx + '-' + Date.now(),
          materialId: i.materialId,
          materialNombre: 'Material Mock ' + i.materialId,
          cantidad: i.cantidad,
          motivo: i.motivo,
          observaciones: i.observaciones,
          estado: 'PENDIENTE'
        }))
      };

      mockDevolucionesStore.push(newDevolucion);
      addMockLog('REGISTRO', newDevolucion, `Registro de devolución con ${newDevolucion.items.length} items`);

      return newDevolucion;
    }
    const response = await apiClient.post('/garantias', data);
    return response.data;
  },

  procesarDevolucion: async (data: ProcesarDevolucionDTO): Promise<Devolucion> => {
    if (shouldUseMockData()) {
      console.log('📦 Simulando procesamiento de devolución en memoria:', data);
      await new Promise(resolve => setTimeout(resolve, 800));

      const index = mockDevolucionesStore.findIndex(d => d.devolucionId === data.devolucionId);
      if (index !== -1) {
        let nuevoEstadoDevolucion = EstadoGarantia.COMPLETADO;

        const nuevosItems = mockDevolucionesStore[index].items.map(item => {
          const processedItem = data.items.find(pi => pi.itemId === item.itemId);
          if (processedItem) {
            let nuevoEstadoItem = 'INSPECCIONADO';
            if (processedItem.destino === 'REPARACION') {
              nuevoEstadoItem = 'EN_REPARACION';
              nuevoEstadoDevolucion = EstadoGarantia.EN_REPARACION;
            } else if (processedItem.destino === 'REINTEGRO') {
              nuevoEstadoItem = 'REINTEGRADO';
            } else if (processedItem.destino === 'ELIMINACION') {
              nuevoEstadoItem = 'ELIMINADO';
            }

            // Log por item procesado
            addMockLog(
              'INSPECCION',
              mockDevolucionesStore[index],
              `Inspección: ${processedItem.resultado} -> ${processedItem.destino}`,
              item
            );

            return {
              ...item,
              estado: nuevoEstadoItem,
              resultadoInspeccion: processedItem.resultado,
              destino: processedItem.destino
            };
          }
          return item;
        });

        mockDevolucionesStore[index] = {
          ...mockDevolucionesStore[index],
          estado: nuevoEstadoDevolucion,
          items: nuevosItems
        };
        return mockDevolucionesStore[index];
      }

      return mockDevolucionesStore[0];
    }
    const response = await apiClient.post(`/garantias/${data.devolucionId}/decision`, data);
    return response.data;
  },

  listarEnReparacion: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<DevolucionListResponse> => {
    if (shouldUseMockData()) {
      const items = mockDevolucionesStore.filter(d =>
        d.items.some(i => i.estado === 'EN_REPARACION')
      );
      return { items, page: 0, limit: 10, total: items.length, totalPages: 1 };
    }
    const response = await apiClient.get('/garantias', {
      params: { ...params, destino: 'REPARACION' }
    });
    return response.data;
  },

  completarReparacion: async (devolucionId: string, itemId: string, resultado: string): Promise<void> => {
    if (shouldUseMockData()) {
      console.log('📦 Simulando completar reparación:', { devolucionId, itemId, resultado });
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockDevolucionesStore.findIndex(d => d.devolucionId === devolucionId);
      if (index !== -1) {
        mockDevolucionesStore[index] = {
          ...mockDevolucionesStore[index],
          items: mockDevolucionesStore[index].items.map(item => {
            if (item.itemId === itemId) {
              const nuevoEstado = resultado === 'REINTEGRAR' ? 'REINTEGRADO' : 'ELIMINADO';
              const nuevoDestino = resultado === 'REINTEGRAR' ? DestinoGarantia.REINTEGRO : DestinoGarantia.ELIMINACION;

              addMockLog(
                resultado === 'REINTEGRAR' ? 'REINTEGRO' : 'ELIMINACION',
                mockDevolucionesStore[index],
                `Reparación completada: ${resultado}`,
                item
              );

              return {
                ...item,
                estado: nuevoEstado,
                destino: nuevoDestino
              };
            }
            return item;
          })
        };

        const quedanEnReparacion = mockDevolucionesStore[index].items.some(i => i.estado === 'EN_REPARACION');
        if (!quedanEnReparacion) {
          mockDevolucionesStore[index].estado = EstadoGarantia.COMPLETADO;
          addMockLog('COMPLETAR', mockDevolucionesStore[index], 'Devolución completada tras reparación');
        }
      }
      return;
    }
    await apiClient.post(`/garantias/${devolucionId}/decision`, { destino: resultado });
  },

  listarHistorial: async (params?: {
    page?: number;
    limit?: number;
    tipo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<HistorialListResponse> => {
    if (shouldUseMockData()) {
      let items = [...mockHistorialStore];

      if (params?.tipo) {
        items = items.filter(log => log.tipo === params.tipo);
      }

      if (params?.fechaDesde) {
        items = items.filter(log => new Date(log.fecha) >= new Date(params.fechaDesde!));
      }

      if (params?.fechaHasta) {
        items = items.filter(log => new Date(log.fecha) <= new Date(params.fechaHasta!));
      }

      return {
        items: items,
        page: 0,
        limit: 100,
        total: items.length,
        totalPages: 1
      };
    }
    const response = await apiClient.get('/garantias/logs', { params });
    return response.data;
  },
};

