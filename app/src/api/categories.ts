import apiClient from './axios';

export interface Category {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export const categoriesAPI = {
  list: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  get: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Omit<Category, 'categoriaId'>): Promise<Category> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Omit<Category, 'categoriaId'>): Promise<Category> => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  activate: async (id: string): Promise<Category> => {
    const response = await apiClient.post(`/categories/${id}/activate`);
    return response.data;
  },

  deletePermanent: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}/permanent`);
  },

  hasMaterials: async (id: string): Promise<boolean> => {
    const response = await apiClient.get(`/categories/${id}/has-materials`);
    return response.data;
  },
};
