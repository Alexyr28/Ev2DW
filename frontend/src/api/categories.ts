import { http } from "./http";

type ApiWrapper<T> = { success: boolean; message: string; data: T };

export type CategoryResponse = {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
};

export const categoriesApi = {
  getAll: async (): Promise<CategoryResponse[]> => {
    const res = await http<ApiWrapper<CategoryResponse[]>>("/api/categorias");
    return res.data;
  },
};
