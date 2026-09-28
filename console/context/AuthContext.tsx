"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "email";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => void;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: () => {},
  loginWithEmail: () => {},
  logout: () => {},
});

// Helper to decode JWT payload without external library
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

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

  const loginWithGoogle = (credential: string) => {
    const payload = parseJwt(credential);
    if (payload && payload.email) {
      const newUser: User = {
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        avatar: payload.picture,
        provider: "google",
      };
      setUser(newUser);
      localStorage.setItem("lyra_user", JSON.stringify(newUser));
      router.push("/dashboard");
    }
  };

  const loginWithEmail = (email: string, name?: string) => {
    const newUser: User = {
      email: email.trim().toLowerCase(),
      name: name?.trim() || email.split("@")[0],
      provider: "email",
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
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
