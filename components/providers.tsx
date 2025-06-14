"use client";
import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HeroUIProvider>
          <ToastProvider placement="bottom-right" />
          {children}
        </HeroUIProvider>
      </ThemeProvider>
    </AuthProvider>
  );
} 