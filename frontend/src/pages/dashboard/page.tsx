import { useAuth } from "../../context/AuthContext";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TECNICO: "Técnico",
  USUARIO: "Usuario",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  TECNICO: "bg-blue-100 text-blue-700",
  USUARIO: "bg-green-100 text-green-700",
};

type StatCard = { label: string; value: string | number; description: string };

function getStatCards(role: string): StatCard[] {
  if (role === "ADMIN") {
    return [
      { label: "Tickets totales", value: "—", description: "En el sistema" },
      { label: "Tickets abiertos", value: "—", description: "Sin resolver" },
      { label: "Técnicos activos", value: "—", description: "Con tickets asignados" },
      { label: "Usuarios registrados", value: "—", description: "En la plataforma" },
    ];
  }
  if (role === "TECNICO") {
    return [
      { label: "Asignados a mí", value: "—", description: "Tickets activos" },
      { label: "Resueltos", value: "—", description: "Este mes" },
      { label: "Pendientes", value: "—", description: "Sin atender" },
    ];
  }
  return [
    { label: "Mis tickets", value: "—", description: "Creados por mí" },
    { label: "Abiertos", value: "—", description: "En progreso" },
    { label: "Resueltos", value: "—", description: "Cerrados" },
  ];
}

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const cards = getStatCards(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Bienvenido, {user.nombre} {user.apellido}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
              ROLE_COLORS[user.role] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
          <span className="text-sm text-slate-400">{user.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{card.value}</p>
            <p className="text-xs text-slate-400 mt-1">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
