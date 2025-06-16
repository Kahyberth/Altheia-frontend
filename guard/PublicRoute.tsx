"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated by looking at localStorage
    const checkAuth = () => {
      try {
        const authUser = localStorage.getItem("authUser");
        const isAuth = !!authUser && authUser !== "null";
        
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
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

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          classNames={{ label: "text-foreground mt-4" }}
          label="Redirigiendo al dashboard..."
          variant="wave"
        />
      </div>
    );
  }

  return <>{children}</>;
} 