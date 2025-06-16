"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Users,
  Activity,
  FileText,
  User,
  Plus,
  Filter,
  ChevronRight,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PatientChart } from "@/components/patient-chart"
import { AppointmentList } from "@/components/appointment-list"
import { RecentActivity } from "@/components/recent-activity"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { getClinicByClinicId, getPatientsInClinic, getPersonnelInClinic } from "@/services/clinic.service"
import { useAuth } from "@/context/AuthContext"
import { getClinicInformation } from "@/services/clinic.service"
import { useRouter } from 'next/navigation';
import { Appointment, appointmentService } from "@/services/appointment.service"
import apiClient from "@/fetch/apiClient"

export default function PhysicianDashboardPage() {
  const isMobile = useMobile()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const router = useRouter();
  const { user } = useAuth()


  const actions = [
    {
      title: 'Mis Citas',
      icon: Calendar,
      color: 'bg-cyan-50 text-cyan-600',
      href: 'appointments',
    },
    {
      title: 'Mi Perfil',
      icon: Settings,
      color: 'bg-amber-50 text-amber-600',
      href: 'profile',
    },
    {
      title: 'Mis Pacientes',
      icon: Users,
      color: 'bg-green-50 text-green-600',
      href: 'patients',
    },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return;
      const res = await getPatientsInClinic(user?.clinic_id!);
      setPatients(res.data);
    };
    fetchPatients();
  }, [user]);


  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      const info = await apiClient.get(`/auth/user/${user.id}`)
      console.log(info)
      const physicianId = info.data.role_details.physician_id
      console.log(physicianId)
      const res = await appointmentService.getAppointmentsByPhysicianId(physicianId!)
      console.log(res)
      setAppointments(res);
    };
    fetchAppointments();
  }, [user]);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 24 
      } 
    }
  }

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
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Cargando tu panel...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
       

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <motion.div variants={item} className="mb-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Bienvenido, Dr. {user?.name}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Aquí tienes toda tu información de salud
                  </p>
                </div>
              </motion.div>
            {/* Overview Cards */}
            <motion.div variants={item}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {[
                  {
                    title: "Pacientes",
                    value: patients.length,
                    changeType: "positive",
                    icon: Users,
                    color: "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
                  },
                  {
                    title: "Citas de hoy",
                    value: appointments.filter(appointment => appointment.date_time.split("T")[0] === new Date().toISOString().split("T")[0]).length,
                    changeType: "positive",
                    icon: Calendar,
                    color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300",
                  }
                ].map((card, i) => (
                  <Card key={i} className="overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-full ${card.color} p-2`}>
                          <card.icon className="h-5 w-5" />
                        </div>
                        <Badge
                          variant={card.changeType === "positive" ? "outline" : "destructive"}
                          className={
                            card.changeType === "positive"
                              ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-300"
                              : ""
                          }
                        >
                          {card.changeType === "positive" ? "+" : ""}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                        <h3 className="mt-1 text-2xl font-bold dark:text-white">{card.value}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Main Dashboard Content */}
            <div className="grid gap-4 lg:grid-cols-12">
              {/* Left Column - 8/12 width */}
              <motion.div variants={item} className="space-y-4 lg:col-span-8">
                
                {/* Quick Actions - More prominent placement */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-1">
                    <CardTitle className="dark:text-white">Acciones rápidas</CardTitle>
                    <CardDescription className="dark:text-slate-400">Herramientas y atajos frecuentes</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    {actions.map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-24 flex-col gap-3 p-4 justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white transition-all duration-200 hover:scale-105"
                        onClick={() => router.push(`/dashboard/${action.href}`)}
                      >
                        <div className={`rounded-full ${action.color} p-3`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-center">{action.title}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Patient Analytics - Full width for better visibility */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="dark:text-white">Análisis de pacientes</CardTitle>
                        <CardDescription className="dark:text-slate-400">Monitorear métricas de pacientes y tendencias de salud</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PatientChart clinicId={user?.clinic_id} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - 4/12 width */}
              <motion.div variants={item} className="space-y-6 lg:col-span-4">
                
                {/* Today's Appointments - Higher priority */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="dark:text-white">Citas de hoy</CardTitle>
                        <CardDescription className="dark:text-slate-400">
                          {new Date().toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric" })}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 gap-1 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700" onClick={() => router.push("/dashboard/appointments")}>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Agregar</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-80 overflow-y-auto">
                    <AppointmentList appointments={appointments.filter(appointment => appointment.date_time.split("T")[0] === new Date().toISOString().split("T")[0])} />
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 dark:bg-slate-700 dark:border-slate-600 px-6 py-3">
                    <Button variant="ghost" className="w-full justify-center gap-1 text-blue-600 dark:text-blue-400 dark:hover:bg-slate-600" onClick={() => router.push("/dashboard/appointments")}>
                      <Calendar className="h-4 w-4" />
                      <span>Ver calendario completo</span>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Recent Activity - Compact version */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg dark:text-white">Actividad reciente</CardTitle>
                        <CardDescription className="dark:text-slate-400">Últimas actualizaciones</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-blue-600 dark:text-blue-400 dark:hover:bg-slate-700">
                        <span>Ver todos</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-60 overflow-y-auto">
                    <RecentActivity />
                  </CardContent>
                </Card>

                {/* Analytics Overview - Compact version */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg dark:text-white">Métricas del sistema</CardTitle>
                    <CardDescription className="dark:text-slate-400">Rendimiento y estadísticas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsOverview />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}