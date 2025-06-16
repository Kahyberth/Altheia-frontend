"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Clock,
  Plus,
  Menu,
  CalendarCheck,
  UserPlus,
  CreditCard,
  Users2,
  Filter,
  FileText,
  ClipboardCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMobile } from "@/hooks/use-mobile";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ReceptionistDashboardPage() {
  const isMobile = useMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const router = useRouter();
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Agendar Cita",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
      href: "/dashboard/appointments",
      description: "Agendar cita para paciente"
    },
    {
      title: "Registrar Paciente", 
      icon: UserPlus,
      color: "bg-green-50 text-green-600",
      href: "/dashboard/patients",
      description: "Añadir nuevo paciente"
    },
    {
      title: "Historiales Médicos",
      icon: FileText,
      color: "bg-purple-50 text-purple-600", 
      href: "/dashboard/medical-records",
      description: "Ver historiales clínicos"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
            <Users className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Cargando dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white dark:bg-slate-800 dark:border-slate-700 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden dark:text-white dark:hover:bg-slate-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <h1 className="text-lg font-semibold dark:text-white">
                Dashboard de Recepción
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="space-y-6"
            >
              {/* Welcome Section */}
              <motion.div variants={item} className="mb-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Bienvenida, {user?.name}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Panel de control para gestión de recepción
                  </p>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={item}>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/95 dark:bg-slate-800/90 shadow-lg border-0"
                      onClick={() => router.push(action.href)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${action.color}`}>
                            <action.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {action.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Dashboard Stats */}
              <motion.div variants={item}>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Resumen del Día
                </h2>
                <div className="grid grid-cols-1 gap-4">

                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Pacientes Registrados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        3
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0"></Card>
                </div>
              </motion.div>

              {/* Main Actions Section */}
              <motion.div variants={item}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patients Section */}
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Gestión de Pacientes
                      </CardTitle>
                      <CardDescription>
                        Registrar y gestionar información de pacientes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={() => router.push("/dashboard/patients")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Ver Todos los Pacientes
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Appointments Section */}
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        Gestión de Citas
                      </CardTitle>
                      <CardDescription>
                        Agendar y administrar citas médicas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={() => router.push("/dashboard/appointments")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Ver Todas las Citas
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 