import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ticketsApi, type Priority } from "../../api/tickets";
import { categoriesApi } from "../../api/categories";

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Crítica" },
];

type FormErrors = Partial<Record<"titulo" | "descripcion" | "prioridad" | "categoriaId", string>>;

function validate(titulo: string, descripcion: string, prioridad: string, categoriaId: string): FormErrors {
  const errors: FormErrors = {};
  if (!titulo.trim()) errors.titulo = "El título es obligatorio.";
  else if (titulo.trim().length < 5) errors.titulo = "El título debe tener al menos 5 caracteres.";
  if (!descripcion.trim()) errors.descripcion = "La descripción es obligatoria.";
  else if (descripcion.trim().length < 10) errors.descripcion = "La descripción debe tener al menos 10 caracteres.";
  if (!prioridad) errors.prioridad = "Selecciona una prioridad.";
  if (!categoriaId) errors.categoriaId = "Selecciona una categoría.";
  return errors;
}

export default function CreateTicketForm() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    data: categorias = [],
    isLoading: catLoading,
    isError: catError,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: categoriesApi.getAll,
  });

  function resetForm() {
    setTitulo("");
    setDescripcion("");
    setPrioridad("");
    setCategoriaId("");
    setErrors({});
    setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    const validationErrors = validate(titulo, descripcion, prioridad, categoriaId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await ticketsApi.create({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad: prioridad as Priority,
        categoriaId: Number(categoriaId),
      });
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear el ticket.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nuevo ticket</h1>
          <p className="text-sm text-slate-400 mt-0.5">Completa los campos para crear un ticket</p>
        </div>
        <button
          onClick={() => navigate("/tickets")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Volver
        </button>
      </div>

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          Ticket creado exitosamente.
        </div>
      )}

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Describe el problema en una línea"
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.titulo ? "border-red-400" : "border-slate-200"
            }`}
            aria-invalid={!!errors.titulo}
            aria-describedby={errors.titulo ? "error-titulo" : undefined}
          />
          {errors.titulo && (
            <p id="error-titulo" className="text-red-500 text-xs mt-1">{errors.titulo}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Explica el problema con detalle"
            rows={4}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
              errors.descripcion ? "border-red-400" : "border-slate-200"
            }`}
            aria-invalid={!!errors.descripcion}
            aria-describedby={errors.descripcion ? "error-descripcion" : undefined}
          />
          {errors.descripcion && (
            <p id="error-descripcion" className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
          )}
        </div>

        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium mb-1">
            Prioridad
          </label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.prioridad ? "border-red-400" : "border-slate-200"
            }`}
            aria-invalid={!!errors.prioridad}
            aria-describedby={errors.prioridad ? "error-prioridad" : undefined}
          >
            <option value="">Selecciona una prioridad</option>
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.prioridad && (
            <p id="error-prioridad" className="text-red-500 text-xs mt-1">{errors.prioridad}</p>
          )}
        </div>

        <div>
          <label htmlFor="categoriaId" className="block text-sm font-medium mb-1">
            Categoría
          </label>
          {catLoading ? (
            <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400">
              Cargando categorías…
            </div>
          ) : catError ? (
            <div className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500">
              Error al cargar categorías.
            </div>
          ) : (
            <select
              id="categoriaId"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.categoriaId ? "border-red-400" : "border-slate-200"
              }`}
              aria-invalid={!!errors.categoriaId}
              aria-describedby={errors.categoriaId ? "error-categoriaId" : undefined}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          )}
          {errors.categoriaId && (
            <p id="error-categoriaId" className="text-red-500 text-xs mt-1">{errors.categoriaId}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creando…" : "Crear ticket"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
