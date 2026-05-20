import { NavLink } from "react-router-dom";

type Role = "ADMIN" | "TECNICO" | "USUARIO";
type Props = { role: Role };
type MenuItem = { to: string; label: string };

function getItemsByRole(role: Role): MenuItem[] {
  const base: MenuItem[] = [{ to: "/dashboard", label: "Dashboard" }];
  if (role === "ADMIN")
    return [
      ...base,
      { to: "/tickets", label: "Tickets" },
      { to: "/usuarios", label: "Usuarios" },
    ];
  if (role === "TECNICO")
    return [...base, { to: "/tickets", label: "Mis tickets asignados" }];
  return [...base, { to: "/tickets", label: "Mis tickets" }];
}

export default function SidebarMenu({ role }: Props) {
  const items = getItemsByRole(role);
  return (
    <nav className="space-y-1">
      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Menú</p>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
