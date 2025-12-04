import apiClient from './axios';

export interface Material {
  materialId: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoriaId: string;
  categoriaNombre?: string;
  unidadBaseId: string;
  unidadBaseNombre?: string;
  unidadBaseSimbolo?: string;
  activo: boolean;
  stockDisponible?: number;
  stockComprometido?: number;
  stockTotal?: number;
  alertaReorden?: boolean;
  reordenConfig?: ReordenConfig;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}

export interface ReordenConfig {
  stockMinimo: number;
  puntoReorden: number;
  activarAlerta?: boolean;
}

export interface MaterialCreateDTO {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoriaId: string;
  unidadBaseId: string;
  activo?: boolean;
  reordenConfig?: ReordenConfig;
}

export interface MaterialListResponse {
  items: Material[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MaterialImportResponse {
  totalProcesados: number;
  exitosos: number;
  fallidos: number;
  errores: string[];
  materialesCreados: Material[];
}

export const materialsAPI = {
  list: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    categoria?: string;
    activo?: boolean;
    search?: string;
  }): Promise<MaterialListResponse> => {
    const response = await apiClient.get('/materials', { params });
    return response.data;
  },

  get: async (id: string): Promise<Material> => {
    const response = await apiClient.get(`/materials/${id}`);
    return response.data;
  },

  create: async (data: MaterialCreateDTO): Promise<Material> => {
    const response = await apiClient.post('/materials', data);
    return response.data;
  },

  update: async (id: string, data: MaterialCreateDTO): Promise<Material> => {
    const response = await apiClient.put(`/materials/${id}`, data);
    return response.data;
  },

  patch: async (id: string, data: Partial<MaterialCreateDTO>): Promise<Material> => {
    const response = await apiClient.patch(`/materials/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/materials/${id}`);
  },

  activate: async (id: string): Promise<Material> => {
    const response = await apiClient.post(`/materials/${id}/activate`);
    return response.data;
  },

  setReorderConfig: async (id: string, config: ReordenConfig): Promise<void> => {
    await apiClient.put(`/materials/${id}/reorder-config`, config);
  },

  importMaterials: async (file: File): Promise<MaterialImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/materials/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  exportMaterials: async (params?: {
    sort?: string;
    categoria?: string;
    activo?: boolean;
    search?: string;
  }): Promise<Blob> => {
    const response = await apiClient.get('/materials/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
