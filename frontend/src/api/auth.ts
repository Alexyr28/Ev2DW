// src/api/auth.ts
import { http } from "./http";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthResponse = {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export const authApi = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await http<ApiWrapper<AuthResponse>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return res.data;
  },
};
