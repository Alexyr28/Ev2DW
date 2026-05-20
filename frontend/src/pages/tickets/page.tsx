import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ticketsApi, type TicketStatus, type Priority } from "../../api/tickets";

const STATUS_LABELS: Record<TicketStatus, string> = {
  ABIERTO: "Abierto",
  EN_PROCESO: "En proceso",
  PENDIENTE: "Pendiente",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  ABIERTO: "bg-blue-100 text-blue-700",
  EN_PROCESO: "bg-amber-100 text-amber-700",
  PENDIENTE: "bg-orange-100 text-orange-700",
  RESUELTO: "bg-green-100 text-green-700",
  CERRADO: "bg-slate-100 text-slate-600",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  BAJA: "bg-slate-100 text-slate-500",
  MEDIA: "bg-blue-100 text-blue-600",
  ALTA: "bg-orange-100 text-orange-700",
  CRITICA: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<Priority | "">("");
  const [filterCategoria, setFilterCategoria] = useState<string>("");

  const { data: tickets = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: ticketsApi.getAll,
  });

  const categorias = Array.from(
    new Map(
      tickets
        .filter((t) => t.categoriaId !== null)
        .map((t) => [t.categoriaId, t.categoriaNombre!])
    ).entries()
  );

  const filtered = tickets.filter((t) => {
    const matchSearch = t.titulo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchPriority = !filterPriority || t.prioridad === filterPriority;
    const matchCategoria =
      !filterCategoria || String(t.categoriaId) === filterCategoria;
    return matchSearch && matchStatus && matchPriority && matchCategoria;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isLoading ? "Cargando…" : `${filtered.length} resultado(s)`}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Refrescar
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por título…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TicketStatus | "")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority | "")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las prioridades</option>
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(([id, nombre]) => (
            <option key={id} value={String(id)}>{nombre}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-slate-400 text-sm">Cargando tickets…</div>
      )}

      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <p className="font-medium">Error al cargar los tickets</p>
          <p className="mt-1 text-red-500 text-xs font-mono">
            {(error as Error)?.message ?? "Error desconocido"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-red-700 underline text-xs"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm">
          No se encontraron tickets con los filtros aplicados.
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-slate-600">#</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Título</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Prioridad</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Categoría</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Asignado a</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Creado por</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono">#{ticket.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-xs">
                    <span className="line-clamp-1">{ticket.titulo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[ticket.prioridad]}`}>
                      {PRIORITY_LABELS[ticket.prioridad]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {ticket.categoriaNombre ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {ticket.asignadoANombreCompleto ?? ticket.asignadoAUsername ?? (
                      <span className="text-slate-300">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{ticket.creadoPorUsername}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
