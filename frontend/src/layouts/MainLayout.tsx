import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarMenu from "../components/SidebarMenu";

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r shadow-sm p-4 flex-shrink-0 flex flex-col">
        <div className="flex-1">
          <SidebarMenu role={user?.role ?? "USUARIO"} />
        </div>
        <div className="border-t pt-4">
          <p className="text-xs font-medium text-slate-700 truncate">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
