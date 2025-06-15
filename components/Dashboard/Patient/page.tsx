"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Activity,
  FileText,
  User,
  FlaskConical,
  Clock,
  MapPin,
  CalendarSync,
  CalendarX,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function PatientDashboardPage() {
  const isMobile = useMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const router = useRouter();
  const { user } = useAuth();

  const actions = [
    {
      title: "Mi perfil",
      icon: User,
      color: "bg-blue-50 text-blue-600",
      href: "profile",
    },
    {
      title: "Citas",
      icon: Calendar,
      color: "bg-cyan-50 text-cyan-600",
      href: "appointments",
    },
    {
      title: "Historial Clínico",
      icon: FileText,
      color: "bg-amber-50 text-amber-600",
      href: "clinic-management",
    },
    {
      title: "Laboratorio",
      icon: FlaskConical,
      color: "bg-green-50 text-green-600",
      href: "laboratory",
    },
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
      transition: { type: "spring", stiffness: 300, damping: 24 },
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

  const patientData = {
    name: "Sarah Johnson",
    age: 42,
    gender: "Female",
    bloodType: "A+",
    height: "5'6\"",
    weight: "145 lbs",
    bmi: 23.4,
    address: "123 Main St, Anytown, CA 94321",
    phone: "(555) 123-4567",
    email: "sarah.johnson@example.com",
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Spouse",
      phone: "(555) 987-6543",
    },
    nextAppointment: {
      doctor: "Dr. Rebecca Taylor",
      specialty: "Cardiology",
      date: "June 15, 2025",
      time: "10:30 AM",
      location: "Main Medical Center",
      address: "456 Health Ave, Anytown, CA 94321",
    },
    vitalSigns: {
      bloodPressure: "120/80 mmHg",
      heartRate: 72,
      temperature: "98.6°F",
      respiratoryRate: 16,
      oxygenSaturation: 98,
    },
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        purpose: "Blood pressure",
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily at bedtime",
        purpose: "Cholesterol",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily with meals",
        purpose: "Blood sugar",
      },
    ],
    recentActivity: [
      {
        type: "Appointment",
        description: "Annual Physical Examination",
        date: "May 10, 2025",
        doctor: "Dr. James Wilson",
      },
      {
        type: "Lab Result",
        description: "Complete Blood Count",
        date: "May 12, 2025",
        status: "Normal",
      },
      {
        type: "Prescription",
        description: "Lisinopril Refill",
        date: "May 15, 2025",
        status: "Filled",
      },
    ],
  };

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
                          onClick={() => router.push(`/dashboard/${action.href}`)}
                        >
                          <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                            <action.icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium text-center leading-tight">{action.title}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Priority Section - Next Appointment */}
              <motion.div variants={item} className="mb-6">
                <NextAppointmentCard appointment={patientData.nextAppointment} />
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* Lab Results - Takes more space on larger screens */}
                <motion.div variants={item} className="lg:col-span-1 xl:col-span-2">
                  <LabResults results={mockResults} />
                </motion.div>

                {/* Recent Activity - Sidebar on larger screens */}
                <motion.div variants={item} className="lg:col-span-1 xl:col-span-1">
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
    </div>
  );
}
