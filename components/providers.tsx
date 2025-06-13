"use client";
import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { AuthProvider } from "@/context/AuthContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-right" />
        {children}
      </HeroUIProvider>
    </AuthProvider>
  );
} 