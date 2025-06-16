"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Activity, FileText, User, FlaskConical } from "lucide-react";

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
import { AnalyticsOverview } from "@/components/analytics-overview";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { NextAppointmentCard } from "./next-appointment-card";
import LabResults from "./lab-results";
import { RecentActivity } from "@/components/recent-activity";
import { ClinicalHistoryViewerPatient } from "./clinical-history-viewer-patient";
import {
  appointmentService,
  Appointment as BackendAppointment,
} from "@/services/appointment.service";
import { getAllServices } from "@/services/clinic.service";
import { format } from "date-fns";

export default function PatientDashboardPage() {
  const isMobile = useMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showClinicalHistory, setShowClinicalHistory] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<any>(null);

  const router = useRouter();
  const { user } = useAuth();

  const actions = [
    {
      title: "Mi perfil",
      icon: User,
      color: "bg-blue-50 text-blue-600",
      href: "profile",
      action: () => router.push("/dashboard/profile"),
    },
    {
      title: "Citas",
      icon: Calendar,
      color: "bg-cyan-50 text-cyan-600",
      href: "appointments",
      action: () => router.push("/dashboard/appointments"),
    },
    {
      title: "Historial Clínico",
      icon: FileText,
      color: "bg-amber-50 text-amber-600",
      href: "patient-history",
      action: () => router.push("/dashboard/patient-history"),
    },
    {
      title: "Laboratorio",
      icon: FlaskConical,
      color: "bg-green-50 text-green-600",
      href: "laboratory",
      action: () => router.push("/dashboard/laboratory"),
    },
  ];

  const getNextAppointment = (
    appointments: BackendAppointment[],
    specialtyMapping: Record<string, string> = {}
  ) => {
    const now = new Date();

    const upcomingAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date_time);
      return appointmentDate > now && appointment.status !== "cancelled";
    });

    upcomingAppointments.sort((a, b) => {
      return new Date(a.date_time).getTime() - new Date(b.date_time).getTime();
    });

    if (upcomingAppointments.length === 0) return null;

    const nextAppt = upcomingAppointments[0];
    const appointmentDate = new Date(nextAppt.date_time);

    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const dayName = days[appointmentDate.getDay()];
    const day = appointmentDate.getDate();
    const monthName = months[appointmentDate.getMonth()];
    const year = appointmentDate.getFullYear();

    return {
      doctor: nextAppt.physician_name || "Médico no asignado",
      specialty: (() => {
        const originalSpecialty = nextAppt.Physician?.physician_specialty;
        const mappedSpecialty = specialtyMapping[originalSpecialty];
        return mappedSpecialty || originalSpecialty || "Consulta General";
      })(),
      date: `${dayName}, ${day} de ${monthName} de ${year}`,
      time: format(appointmentDate, "h:mm a"),
      location: nextAppt.clinic_name || "Clínica",
      address: nextAppt.clinic_address || "Dirección no disponible",
      appointmentId: nextAppt.id,
      status: nextAppt.status,
      providerId: nextAppt.physician_id,
    };
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;

      try {
        let specialtyMapping: Record<string, string> = {};
        try {
          const servicesResponse = await getAllServices(1, 100);
          const services = Array.isArray(servicesResponse.data)
            ? servicesResponse.data
            : (servicesResponse.data as any).data ?? [];

          services.forEach((service: any) => {
            specialtyMapping[service.id] = service.name;
          });
        } catch (error) {
          console.error("Error loading specialties:", error);
        }

        const backendAppointments =
          await appointmentService.getAppointmentsByUserId(user.id);

        const nextAppt = getNextAppointment(
          backendAppointments,
          specialtyMapping
        );
        setNextAppointment(nextAppt);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAppointments();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.id]);

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
          <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            <Activity className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Cargando tu panel...
          </p>
        </motion.div>
      </div>
    );
  }

  const mockResults = [
    {
      testName: "Hemograma Completo",
      date: "10 May 2025",
      result: "Dentro de parámetros normales",
      status: "Normal",
    },
    {
      testName: "Glucosa en ayunas",
      date: "12 May 2025",
      result: "105 mg/dL",
      status: "Levemente elevado",
    },
    {
      testName: "Colesterol Total",
      date: "15 May 2025",
      result: "190 mg/dL",
      status: "Límite alto",
    },
    {
      testName: "Triglicéridos",
      date: "15 May 2025",
      result: "150 mg/dL",
      status: "Normal",
    },
    {
      testName: "Función hepática (ALT)",
      date: "18 May 2025",
      result: "35 U/L",
      status: "Normal",
    },
    {
      testName: "Función renal (Creatinina)",
      date: "20 May 2025",
      result: "1.1 mg/dL",
      status: "Normal",
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="space-y-6"
            >
              {/* Header Section */}
              <motion.div variants={item} className="mb-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Bienvenido, {user?.name}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Aquí tienes toda tu información de salud
                  </p>
                </div>
              </motion.div>

              {/* Quick Actions Section */}
              <motion.div variants={item} className="mb-8">
                <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Acciones Rápidas
                    </CardTitle>
                    <CardDescription>
                      Accede rápidamente a las funciones más importantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {actions.map((action, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="h-28 flex flex-col items-center justify-center gap-3 p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                          onClick={action.action}
                        >
                          <div
                            className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}
                          >
                            <action.icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium text-center leading-tight">
                            {action.title}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Priority Section - Next Appointment */}
              <motion.div variants={item} className="mb-6">
                {nextAppointment ? (
                  <NextAppointmentCard appointment={nextAppointment} />
                ) : (
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Próxima Cita
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">
                          No tienes citas programadas próximamente
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => router.push("/dashboard/appointments")}
                        >
                          Programar Cita
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Lab Results - Takes more space on larger screens */}
                <motion.div
                  variants={item}
                  className="lg:col-span-1 xl:col-span-2"
                >
                  <LabResults results={mockResults} />
                </motion.div>

                {/* Recent Activity - Sidebar on larger screens */}
                <motion.div
                  variants={item}
                  className="lg:col-span-1 xl:col-span-1"
                >
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0 h-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Actividad Reciente
                      </CardTitle>
                      <CardDescription>
                        Últimas actualizaciones de tu historial
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <RecentActivity />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bottom Section - Analytics Overview */}
              <motion.div variants={item} className="mt-8">
                <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-green-600" />
                      Análisis del Sistema
                    </CardTitle>
                    <CardDescription>
                      Estadísticas y métricas importantes del sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsOverview />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Clinical History Modal */}
      <ClinicalHistoryViewerPatient
        patientId={user?.id}
        open={showClinicalHistory}
        onOpenChange={setShowClinicalHistory}
      />
    </div>
  );
}
