"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  email: string;
  name: string;
  avatar?: string;
  provider: "email" | "developer";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmail: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lyra_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser: User = {
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split("@")[0],
      provider: "developer",
    };
    setUser(newUser);
    localStorage.setItem("lyra_user", JSON.stringify(newUser));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lyra_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
