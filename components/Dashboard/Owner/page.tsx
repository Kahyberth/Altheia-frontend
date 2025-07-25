"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Users,
  Activity,
  FileText,
  User,
  Plus,
  Filter,
  ChevronRight,
  MessageSquare,
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
import { getPatientsInClinic, getPersonnelInClinic } from "@/services/clinic.service"
import { useAuth } from "@/context/AuthContext"
import { getClinicInformation } from "@/services/clinic.service"
import { useRouter } from 'next/navigation';

export default function OwnerDashboardPage() {
  const isMobile = useMobile()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [clinicManagement, setClinicManagement] = useState<any[]>([])
  const [profile, setProfile] = useState<any[]>([])

  const router = useRouter();
  const { user } = useAuth()


  const actions = [
    {
      title: 'Nuevo paciente',
      icon: User,
      color: 'bg-blue-50 text-blue-600',
      href: 'patients',
    },
    {
      title: 'Agendar cita',
      icon: Calendar,
      color: 'bg-cyan-50 text-cyan-600',
      href: 'appointments',
    },
    {
      title: 'Gestión Clínica',
      icon: Settings,
      color: 'bg-amber-50 text-amber-600',
      href: 'clinic-management',
    },
    {
      title: 'Perfil',
      icon: User,
      color: 'bg-green-50 text-green-600',
      href: 'profile',
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
      const clinicRes = await getClinicInformation(user.id);
      const clinicId =
        clinicRes.data.clinic?.id ?? clinicRes.data.information?.clinic_id;

      const res = await getPatientsInClinic(clinicId);
      setPatients(res.data);
    };
    fetchPatients();
  }, [user]);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
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
            <motion.div variants={item} className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight dark:text-white">Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Bienvenido de nuevo, <b>{user?.name}</b>. Aquí está lo que está pasando hoy.</p>
            </motion.div>

            {/* Overview Cards */}
            <motion.div variants={item}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Pacientes",
                    value: patients.length,
                    change: "+4.6%",
                    changeType: "positive",
                    icon: Users,
                    color: "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
                  },
                  {
                    title: "Citas de hoy",
                    value: appointments.length,
                    change: "+12.5%",
                    changeType: "positive",
                    icon: Calendar,
                    color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300",
                  },
                  {
                    title: "Reportes pendientes",
                    value: clinicManagement.length,
                    change: "-2.3%",
                    changeType: "negative",
                    icon: FileText,
                    color: "bg-amber-50 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
                  },
                  {
                    title: "Tiempo de espera promedio",
                    value: "14 min",
                    change: "-5.2%",
                    changeType: "positive",
                    icon: Clock,
                    color: "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300",
                  },
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
                          {card.change}
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
            <div className="grid gap-6 lg:grid-cols-7">
              {/* Left Column - 4/7 width */}
              <motion.div variants={item} className="space-y-6 lg:col-span-4">

                {/* Quick Actions */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="dark:text-white">Acciones rápidas</CardTitle>
                    <CardDescription className="dark:text-slate-400">Herramientas y atajos frecuentes</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {actions.map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-auto flex-col gap-2 p-4 justify-start items-center hover:bg-slate-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white"
                        onClick={() => router.push(`/dashboard/${action.href}`)}
                      >
                        <div className={`rounded-full ${action.color} p-2`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">{action.title}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Tabs for Patient Data */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="dark:text-white">Análisis de pacientes</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-1 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700">
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filtrar</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-slate-800 dark:border-slate-700">
                          <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Últimos 7 días</DropdownMenuItem>
                          <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Últimos 30 días</DropdownMenuItem>
                          <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Últimos 3 meses</DropdownMenuItem>
                          <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Últimos 12 meses</DropdownMenuItem>
                          <DropdownMenuSeparator className="dark:border-slate-600" />
                          <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Rango personalizado</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="dark:text-slate-400">Monitorear métricas de pacientes y tendencias de salud</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="demographics">
                      <TabsList className="mb-4 dark:bg-slate-700">
                        <TabsTrigger value="demographics" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">Demografía</TabsTrigger>
                        <TabsTrigger value="conditions" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">Condiciones</TabsTrigger>
                        <TabsTrigger value="satisfaction" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">Satisfacción</TabsTrigger>
                      </TabsList>
                      <TabsContent value="demographics" className="space-y-4">
                        <PatientChart />
                      </TabsContent>
                      <TabsContent value="conditions">
                        <div className="h-[300px] flex items-center justify-center">
                          <p className="text-slate-500 dark:text-slate-400">Visualización de datos de condición próximamente</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="satisfaction">
                        <div className="h-[300px] flex items-center justify-center">
                          <p className="text-slate-500 dark:text-slate-400">Visualización de datos de satisfacción próximamente</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="dark:text-white">Actividad reciente</CardTitle>
                      <Button variant="ghost" size="sm" className="gap-1 text-blue-600 dark:text-blue-400 dark:hover:bg-slate-700">
                        <span>Ver todos</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="dark:text-slate-400">Últimas actualizaciones y interacciones con pacientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - 3/7 width */}
              <motion.div variants={item} className="space-y-6 lg:col-span-3">
                {/* Today's Appointments */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="dark:text-white">Citas de hoy</CardTitle>
                      <Button variant="outline" size="sm" className="h-8 gap-1 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Agregar</span>
                      </Button>
                    </div>
                    <CardDescription className="dark:text-slate-400">
                      Gestiona tu agenda para{" "}
                      {new Date().toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric" })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppointmentList appointments={appointments} />
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 dark:bg-slate-700 dark:border-slate-600 px-6 py-3">
                    <Button variant="ghost" className="w-full justify-center gap-1 text-blue-600 dark:text-blue-400 dark:hover:bg-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Ver calendario completo</span>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Analytics Overview */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="dark:text-white">Análisis del sistema</CardTitle>
                    <CardDescription className="dark:text-slate-400">Métricas de rendimiento y estadísticas de uso</CardDescription>
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

function Menu({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}