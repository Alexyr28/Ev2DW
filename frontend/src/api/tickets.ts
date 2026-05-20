import { http } from "./http";

type ApiWrapper<T> = { success: boolean; message: string; data: T };

export type TicketStatus = "ABIERTO" | "EN_PROCESO" | "PENDIENTE" | "RESUELTO" | "CERRADO";
export type Priority = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export type CreateTicketDto = {
  titulo: string;
  descripcion: string;
  prioridad: Priority;
  categoriaId: number;
};

export type TicketResponse = {
  id: number;
  titulo: string;
  descripcion: string;
  status: TicketStatus;
  prioridad: Priority;
  categoriaId: number | null;
  categoriaNombre: string | null;
  creadoPorId: number;
  creadoPorUsername: string;
  asignadoAId: number | null;
  asignadoAUsername: string | null;
  asignadoANombreCompleto: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
};

export const ticketsApi = {
  getAll: async (): Promise<TicketResponse[]> => {
    const res = await http<ApiWrapper<TicketResponse[]>>("/api/tickets");
    return res.data;
  },

  create: async (dto: CreateTicketDto): Promise<TicketResponse> => {
    const res = await http<ApiWrapper<TicketResponse>>("/api/tickets", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return res.data;
  },
};
