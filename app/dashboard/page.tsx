"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Users,
  Activity,
  FileText,
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Plus,
  Filter,
  ChevronRight,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { user } from "@heroui/react"
import { useAuth } from "@/context/AuthContext"
import { getClinicInformation } from "@/services/clinic.service"

export default function DashboardPage() {
  const isMobile = useMobile()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [patients, setPatients] = useState<any[]>([])

  const { user } = useAuth()

  useEffect(() => {
    // Simulate data loading
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
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
          <p className="mt-4 text-sm text-slate-600">Cargando tu panel...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú</span>
            </Button>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search patients, records, or appointments..."
                className="w-full bg-slate-50 pl-8 focus-visible:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notificaciones</span>
                  <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  {
                    title: "Nueva solicitud de cita",
                    description: "Sarah Johnson requested an appointment for tomorrow at 10:00 AM",
                    time: "10 minutes ago",
                    icon: Calendar,
                    color: "text-blue-600",
                  },
                  {
                    title: "Resultados de laboratorio disponibles",
                    description: "New lab results are available for Michael Chen",
                    time: "1 hour ago",
                    icon: FileText,
                    color: "text-green-600",
                  },
                  {
                    title: "Recordatorio de medicación",
                    description: "Reminder to update prescription for Amanda Rodriguez",
                    time: "3 hours ago",
                    icon: Bell,
                    color: "text-amber-600",
                  },
                ].map((notification, i) => (
                  <DropdownMenuItem key={i} className="flex cursor-pointer flex-col items-start p-4">
                    <div className="flex w-full items-start gap-3">
                      <div className={`mt-0.5 rounded-full bg-slate-100 p-1.5 ${notification.color}`}>
                        <notification.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-slate-500">{notification.description}</p>
                        <p className="text-xs text-slate-400">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  <span className="text-sm font-medium text-blue-600">Ver todas las notificaciones</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2" size="sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=DR" alt="Dr. Rebecca Taylor" />
                    <AvatarFallback>RT</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">Dr. Rebecca Taylor</p>
                    <p className="text-xs text-slate-500">Cardiologist</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <motion.div variants={item} className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, Dr. Taylor. Here's what's happening today.</p>
            </motion.div>

            {/* Overview Cards */}
            <motion.div variants={item}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Total Patients",
                    value: patients.length,
                    change: "+4.6%",
                    changeType: "positive",
                    icon: Users,
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    title: "Appointments Today",
                    value: "24",
                    change: "+12.5%",
                    changeType: "positive",
                    icon: Calendar,
                    color: "bg-cyan-50 text-cyan-600",
                  },
                  {
                    title: "Pending Reports",
                    value: "8",
                    change: "-2.3%",
                    changeType: "negative",
                    icon: FileText,
                    color: "bg-amber-50 text-amber-600",
                  },
                  {
                    title: "Average Wait Time",
                    value: "14 min",
                    change: "-5.2%",
                    changeType: "positive",
                    icon: Clock,
                    color: "bg-green-50 text-green-600",
                  },
                ].map((card, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-full ${card.color} p-2`}>
                          <card.icon className="h-5 w-5" />
                        </div>
                        <Badge
                          variant={card.changeType === "positive" ? "outline" : "destructive"}
                          className={
                            card.changeType === "positive"
                              ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
                              : ""
                          }
                        >
                          {card.change}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-500">{card.title}</p>
                        <h3 className="mt-1 text-2xl font-bold">{card.value}</h3>
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
                {/* Tabs for Patient Data */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Patient Analytics</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filter</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                          <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                          <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                          <DropdownMenuItem>Last 12 months</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Custom range</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>Monitor patient metrics and health trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="demographics">
                      <TabsList className="mb-4">
                        <TabsTrigger value="demographics">Demographics</TabsTrigger>
                        <TabsTrigger value="conditions">Conditions</TabsTrigger>
                        <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
                      </TabsList>
                      <TabsContent value="demographics" className="space-y-4">
                        <PatientChart />
                      </TabsContent>
                      <TabsContent value="conditions">
                        <div className="h-[300px] flex items-center justify-center">
                          <p className="text-slate-500">Condition data visualization coming soon</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="satisfaction">
                        <div className="h-[300px] flex items-center justify-center">
                          <p className="text-slate-500">Satisfaction data visualization coming soon</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Activity</CardTitle>
                      <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
                        <span>View all</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Latest updates and patient interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - 3/7 width */}
              <motion.div variants={item} className="space-y-6 lg:col-span-3">
                {/* Today's Appointments */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Today's Appointments</CardTitle>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>
                    <CardDescription>
                      Manage your schedule for{" "}
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppointmentList />
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 px-6 py-3">
                    <Button variant="ghost" className="w-full justify-center gap-1 text-blue-600">
                      <Calendar className="h-4 w-4" />
                      <span>View Full Calendar</span>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Analytics Overview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>System Analytics</CardTitle>
                    <CardDescription>Performance metrics and usage statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsOverview />
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used tools and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {[
                      { title: "New Patient", icon: User, color: "bg-blue-50 text-blue-600" },
                      { title: "Schedule Appointment", icon: Calendar, color: "bg-cyan-50 text-cyan-600" },
                      { title: "Create Report", icon: FileText, color: "bg-amber-50 text-amber-600" },
                      { title: "Message Team", icon: MessageSquare, color: "bg-green-50 text-green-600" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-auto flex-col gap-2 p-4 justify-start items-center hover:bg-slate-50"
                      >
                        <div className={`rounded-full ${action.color} p-2`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">{action.title}</span>
                      </Button>
                    ))}
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
