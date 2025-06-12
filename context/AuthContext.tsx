"use client";

import {createPatientService, loginService, logoutService, verifySessionService } from "@/services/auth.service";
import {PatientDto } from "@/types/auth";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("authUser");
      }
      setIsLoading(false);
    } else {
      verifySessionService()
        .then((res) => {
          const data = res.data || res;
          if (data.isValid && data.userInfo) {
            setUser(data.userInfo);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  
  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);


  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const response = await loginService({email, password})
      const { user } = response;
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: PatientDto) {
    setIsLoading(true);
    try {
      await createPatientService(data);
    } finally {
      setIsLoading(false);
    }
  }


  async function logout() {
    setIsLoading(true);
    try {
      await logoutService()
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
