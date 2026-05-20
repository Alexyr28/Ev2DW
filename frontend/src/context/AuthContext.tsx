import { createContext, useContext, useState, ReactNode } from "react";

export type AuthUser = {
  token: string;
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: "ADMIN" | "TECNICO" | "USUARIO";
};

type AuthContextType = {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  function login(userData: AuthUser) {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
