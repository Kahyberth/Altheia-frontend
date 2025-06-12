"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          classNames={{ label: "text-foreground mt-4" }}
          label="Verificando sesión..."
          variant="wave"
        />
      </div>
    );
  }

  return <>{children}</>;
}
