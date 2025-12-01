import apiClient from './axios';

export interface Unit {
  unidadId: string;
  nombre: string;
  simbolo: string;
  tipo?: string;
  activo: boolean;
}

export const unitsAPI = {
  list: async (): Promise<Unit[]> => {
    const response = await apiClient.get('/units');
    return response.data;
  },

  get: async (id: string): Promise<Unit> => {
    const response = await apiClient.get(`/units/${id}`);
    return response.data;
  },

  create: async (data: Omit<Unit, 'unidadId'>): Promise<Unit> => {
    const response = await apiClient.post('/units', data);
    return response.data;
  },

  update: async (id: string, data: Omit<Unit, 'unidadId'>): Promise<Unit> => {
    const response = await apiClient.put(`/units/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/units/${id}`);
  },

  activate: async (id: string): Promise<Unit> => {
    const response = await apiClient.post(`/units/${id}/activate`);
    return response.data;
  },
};
