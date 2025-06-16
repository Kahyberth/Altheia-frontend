"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarIcon,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  User,
  FileText,
  MapPin,
  Video,
  CalendarDays,
  CalendarClock,
  CalendarX,
  CalendarCheck,
  Menu,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, startOfWeek, endOfWeek, parseISO, addWeeks, addMinutes, startOfDay, endOfDay } from "date-fns"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { AppointmentDetails } from "@/components/appointment-details"
import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { AppointmentCalendarView } from "@/components/appointment-calendar-view"
import { appointmentService, Appointment as BackendAppointment } from "@/services/appointment.service"
import { getClinicInformationByUser, getAllServices } from "@/services/clinic.service"
import { useAuth } from "@/context/AuthContext"
import { useRole } from "@/hooks/useRole"

// Sample appointment types
const appointmentTypes = [
  { id: "check-up", name: "Check-up", duration: 30 },
  { id: "consultation", name: "Consultation", duration: 45 },
  { id: "follow-up", name: "Follow-up", duration: 30 },
  { id: "procedure", name: "Procedure", duration: 60 },
  { id: "lab-work", name: "Lab Work", duration: 15 },
  { id: "imaging", name: "Imaging", duration: 30 },
  { id: "therapy", name: "Therapy", duration: 60 },
  { id: "vaccination", name: "Vaccination", duration: 15 },
]

// Define types for our frontend data
export interface FrontendAppointment {
  id: string
  patientId: string
  providerId: string
  date: string
  startTime: string
  appointmentType: string
  status: string
  notes: string
  createdAt: string
  updatedAt: string
  patient?: {
    id?: string
    name?: string
    age?: number
    gender?: string
    email?: string
    phone?: string
    avatar?: string
  }
  provider?: {
    id: string
    name: string
    specialty: string
    avatar: string
  }
  locationDetails?: {
    id: string
    name: string
    address: string
  }
}

interface FrontendProvider {
  id: string
  name: string
  specialty: string
  avatar: string
}

export default function AppointmentsPage() {
  const isMobile = useMobile()
  const { user } = useAuth()
  const { isPatient, role } = useRole()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "list">("day")
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [appointments, setAppointments] = useState<FrontendAppointment[]>([])
  const [providers, setProviders] = useState<FrontendProvider[]>([])
  const [specialtyMap, setSpecialtyMap] = useState<Record<string, string>>({})

  // Helper function to transform backend appointments to frontend appointments
  const transformAppointments = (backendAppointments: BackendAppointment[], specialtyMapping: Record<string, string> = {}): FrontendAppointment[] => {
    console.log('Transforming appointments:', backendAppointments)
    
    return backendAppointments.map((apt: BackendAppointment) => {
      console.log('Processing appointment:', apt)
      
      const dateTime = new Date(apt.date_time)
      console.log('Date parsing:', {
        original: apt.date_time,
        parsed: dateTime,
        formatted: format(dateTime, "yyyy-MM-dd"),
        time: format(dateTime, "HH:mm")
      })
      
      // Calculate age from date_of_birth, safely
      const birthDate = apt.Patient?.date_of_birth ? new Date(apt.Patient.date_of_birth) : null;
      const age = birthDate
        ? Math.floor((new Date().getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;
      
      // Get patient name from various possible sources
      const patientName = apt.patient_name || apt.Patient?.name || "Unknown Patient"
      
      // Get physician name from various possible sources  
      const physicianName = apt.physician_name || "Unknown Physician"
      
      const transformed = {
        id: apt.id,
        patientId: apt.patient_id,
        providerId: apt.physician_id,
        date: format(dateTime, "yyyy-MM-dd"),
        startTime: format(dateTime, "HH:mm"),
        appointmentType: apt.reason,
        status: mapBackendStatus(apt.status),
        notes: apt.reason,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
                 patient: {
           id: apt.Patient?.id,
           name: patientName,
           age: age,
           gender: apt.patient_gender,
           email: apt.patient_email,
           phone: apt.patient_phone,
           avatar: "/placeholder.svg?height=128&width=128&text=" + (patientName || "?").split(" ").map((n: string) => n[0] || "?").join(""),
         },
        provider: apt.Physician ? {
          id: apt.Physician.id,
          name: physicianName,
          specialty: (() => {
            const originalSpecialty = apt.Physician.physician_specialty;
            const mappedSpecialty = specialtyMapping[originalSpecialty];
            return mappedSpecialty || originalSpecialty || "General";
          })(),
                     avatar: "/placeholder.svg?height=128&width=128&text=" + (physicianName || "?").split(" ").map((n: string) => n[0] || "?").join(""),
        } : undefined,
        locationDetails: {
          id: apt.clinic_id,
          name: apt.clinic_name || "Unknown Clinic",
          address: apt.clinic_address || "Unknown Address",
        },
      }
      
      console.log('Transformed appointment:', transformed)
      return transformed
    })
  }

  // Helper function to fetch and set appointments for a physician
  const fetchAppointmentsForPhysician = async (physicianId: string, specialtyMapping: Record<string, string> = {}) => {
    try {
      console.log('Fetching appointments for physician ID:', physicianId)
      const backendAppointments = await appointmentService.getAppointmentsByPhysicianId(physicianId)
      console.log('Fetched appointments:', backendAppointments)
      
      const transformedAppointments = transformAppointments(backendAppointments, specialtyMapping)
      setAppointments(transformedAppointments)
      console.log("TRANSFORMED APPOINTMENTS", transformedAppointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  // Helper function to fetch and set appointments for a patient
  const fetchAppointmentsForPatient = async (userId: string, specialtyMapping: Record<string, string> = {}) => {
    try {
      console.log('Fetching appointments for user ID:', userId)
      const backendAppointments = await appointmentService.getAppointmentsByUserId(userId)
      console.log('Fetched patient appointments:', backendAppointments)
      
      const transformedAppointments = transformAppointments(backendAppointments, specialtyMapping)
      setAppointments(transformedAppointments)
      console.log("TRANSFORMED PATIENT APPOINTMENTS", transformedAppointments)
    } catch (error) {
      console.error('Error fetching patient appointments:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      
      try {
        // Load services/specialties to create mapping first
        let specialtyMapping: Record<string, string> = {}
        try {
          const servicesResponse = await getAllServices(1, 100) // Get all services
          const services = Array.isArray(servicesResponse.data) 
            ? servicesResponse.data 
            : (servicesResponse.data as any).data ?? []
          
          // Create mapping of ID to name
          services.forEach((service: any) => {
            specialtyMapping[service.id] = service.name
          })
          setSpecialtyMap(specialtyMapping)
          console.log('Specialty mapping:', specialtyMapping)
        } catch (error) {
          console.error('Error loading specialties:', error)
        }

        // If user is a patient, fetch only their appointments
        if (user?.role === 'patient') {
          console.log('User is a patient, fetching patient appointments for user ID:', user.id)
          await fetchAppointmentsForPatient(user.id, specialtyMapping)
        } else {
          // For staff/physicians, show appointments from clinic
          // Get clinic information to fetch physicians from current clinic only
          const clinicResponse = await getClinicInformationByUser(user)
          const clinic = clinicResponse.data?.clinic
          
          if (!clinic) {
            console.error("No clinic found for user")
            return
          }

          // Transform physicians from clinic data
          const transformedPhysicians = clinic.physicians
            .filter((physician) => physician.status && physician.user?.status) // Only active physicians
            .map((physician) => ({
              id: physician.id, // Use the physician's ID directly from clinic data
              name: physician.user.name,
              specialty: specialtyMapping[physician.physician_specialty] || physician.physician_specialty, // Map ID to name
              avatar: "/placeholder.svg?height=128&width=128&text=" + physician.user.name.split(" ").map(n => n[0]).join(""),
            }))
          
          console.log('Clinic physicians:', transformedPhysicians)
          setProviders(transformedPhysicians)

          // Fetch appointments for the first physician from the clinic
          if (transformedPhysicians.length > 0) {
            await fetchAppointmentsForPhysician(transformedPhysicians[0].id, specialtyMapping)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id, user?.role])

  // Helper function to map backend status to frontend status
  const mapBackendStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "scheduled"
      case "confirmed":
        return "confirmed"
      case "in_progress":
        return "checked-in"
      case "completed":
        return "completed"
      case "cancelled":
        return "cancelled"
      default:
        return "scheduled"
    }
  }

  // Helper function to map frontend status to backend status
  const mapFrontendStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "pending"
      case "confirmed":
        return "confirmed"
      case "checked-in":
        return "in_progress"
      case "completed":
        return "completed"
      case "cancelled":
        return "cancelled"
      default:
        return "pending"
    }
  }

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  // Get appointment details
  const appointmentDetails = useMemo(() => {
    if (!selectedAppointment) return null
    const appointment = appointments.find((apt: FrontendAppointment) => apt.id === selectedAppointment)
    if (!appointment) return null

    return {
      ...appointment,
      type: appointment.appointmentType,
      location: appointment.locationDetails,
    }
  }, [selectedAppointment, appointments])

  // Filter appointments based on selected date, search query, and filters
  const filteredAppointments = useMemo(() => {
    console.log('All appointments:', appointments)
    console.log('Selected date:', selectedDate)
    console.log('View mode:', viewMode)
    
    return appointments.filter((appointment: FrontendAppointment) => {
      // Filter by date based on view mode
      if (viewMode === "day") {
        const appointmentDate = parseISO(appointment.date)
        const selectedDateStart = startOfDay(selectedDate)
        const selectedDateEnd = endOfDay(selectedDate)
        console.log('Day view filtering:', {
          appointmentId: appointment.id,
          appointmentDate: appointmentDate,
          selectedDateStart: selectedDateStart,
          selectedDateEnd: selectedDateEnd,
          isInRange: appointmentDate >= selectedDateStart && appointmentDate <= selectedDateEnd
        })
        if (appointmentDate < selectedDateStart || appointmentDate > selectedDateEnd) return false
      } else if (viewMode === "week") {
        const appointmentDate = parseISO(appointment.date)
        const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 })
        console.log('Week view filtering:', {
          appointmentId: appointment.id,
          appointmentDate: appointmentDate,
          weekStart: weekStart,
          weekEnd: weekEnd,
          isInRange: appointmentDate >= weekStart && appointmentDate <= weekEnd
        })
        if (appointmentDate < weekStart || appointmentDate > weekEnd) return false
      }

      // Filter by search query
      if (searchQuery) {
        const patient = appointment.patient
        const provider = appointment.provider
        const searchLower = searchQuery.toLowerCase()

        const matchesPatient = patient?.name?.toLowerCase().includes(searchLower)
        const matchesProvider = provider?.name.toLowerCase().includes(searchLower)
        const matchesNotes = appointment.notes.toLowerCase().includes(searchLower)
        const matchesId = appointment.id.toLowerCase().includes(searchLower)

        if (!matchesPatient && !matchesProvider && !matchesNotes && !matchesId) return false
      }

      // Filter by status
      if (statusFilter !== "all" && appointment.status !== statusFilter) return false

      // Filter by provider
      if (providerFilter !== "all" && appointment.providerId !== providerFilter) return false

      // Filter by location
      if (locationFilter !== "all" && appointment.locationDetails?.id !== locationFilter) return false

      // Filter by type
      if (typeFilter !== "all" && appointment.appointmentType !== typeFilter) return false

      return true
    })
  }, [
    appointments,
    selectedDate,
    viewMode,
    searchQuery,
    statusFilter,
    providerFilter,
    locationFilter,
    typeFilter,
    weekStartDate,
  ])

  // Group appointments by date for list view
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, FrontendAppointment[]> = {}
    filteredAppointments.forEach((appointment: FrontendAppointment) => {
      if (!grouped[appointment.date]) {
        grouped[appointment.date] = []
      }
      grouped[appointment.date].push(appointment)
    })
    return grouped
  }, [filteredAppointments])

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId) 
    setShowCancelDialog(true)
  }

  // Confirm appointment cancellation
  const confirmCancelAppointment = () => {
    console.log(`Cancelling appointment ${appointmentToCancel}`)
    appointmentService.cancelAppointment(appointmentToCancel as string)
    setShowCancelDialog(false)
    setAppointmentToCancel(null)
  }

  // Navigate to previous day/week
  const navigatePrevious = () => {
    if (viewMode === "day") {
      setSelectedDate((prev) => addDays(prev, -1))
    } else if (viewMode === "week") {
      setWeekStartDate((prev) => addWeeks(prev, -1))
    }
  }

  // Navigate to next day/week
  const navigateNext = () => {
    if (viewMode === "day") {
      setSelectedDate((prev) => addDays(prev, 1))
    } else if (viewMode === "week") {
      setWeekStartDate((prev) => addWeeks(prev, 1))
    }
  }

  // Navigate to today
  const navigateToday = () => {
    setSelectedDate(new Date())
    setWeekStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  }

  const handleAppointmentCreated = async () => {
    console.log('Appointment created, refreshing data...')
    console.log('Current user info in handleAppointmentCreated:', {
      userId: user?.id,
      userRole: user?.role,
      specialtyMapLength: Object.keys(specialtyMap).length
    })
    
    if (user?.role === 'patient') {
      console.log('Refreshing appointments for patient user ID:', user?.id)
      // Refresh appointments for the current patient
      await fetchAppointmentsForPatient(user?.id || '', specialtyMap)
    } else {
      console.log('Refreshing appointments for physician. Providers length:', providers.length)
      // Refresh appointments for the current physician
      if (providers.length > 0) {
        console.log('Using physician ID:', providers[0].id)
        await fetchAppointmentsForPhysician(providers[0].id, specialtyMap)
      }
    }
    console.log('Data refresh completed')
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
            <Calendar className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Cargando citas...</p>
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
        {/* Header is included in the DashboardSidebar component */}

        {/* Appointments Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <motion.div variants={item} className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {user?.role === 'patient' ? "Mis Citas" : "Appointments"}
              </h1>
              <p className="text-sm text-slate-500">
                {user?.role === 'patient' 
                  ? "Consulta y gestiona tus citas médicas" 
                  : "Manage and schedule patient appointments"
                }
              </p>
            </motion.div>

            {/* Appointment Actions and Date Navigation */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={navigatePrevious}>
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={navigateNext}>
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next</span>
                        </Button>
                        <Button variant="outline" onClick={navigateToday}>
                          Today
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left md:w-auto">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {viewMode === "day" && format(selectedDate, "MMMM d, yyyy")}
                              {viewMode === "week" && (
                                <>
                                  {format(weekStartDate, "MMM d")} - {format(addDays(weekStartDate, 6), "MMM d, yyyy")}
                                </>
                              )}
                              {viewMode === "list" && "Date Range"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                if (date) {
                                  setSelectedDate(date)
                                  setWeekStartDate(startOfWeek(date, { weekStartsOn: 1 }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 rounded-md border bg-white p-1">
                        <Button
                          variant={viewMode === "day" ? "default" : "ghost"}
                          size="sm"
                          className="h-8"
                          onClick={() => setViewMode("day")}
                        >
                          Day
                        </Button>
                        <Button
                          variant={viewMode === "week" ? "default" : "ghost"}
                          size="sm"
                          className="h-8"
                          onClick={() => setViewMode("week")}
                        >
                          Week
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          className="h-8"
                          onClick={() => setViewMode("list")}
                        >
                          List
                        </Button>
                      </div>
                      <Button onClick={() => setShowNewAppointmentDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {user?.role === 'patient' ? "Nueva Cita" : "New Appointment"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={item}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="search"
                    placeholder={user?.role === 'patient'
                      ? "Buscar en tus citas..." 
                      : "Search appointments by patient, provider, or notes..."
                    }
                    className="w-full pl-8 focus-visible:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {user?.role !== 'patient' && (
                    <Select value={providerFilter} onValueChange={setProviderFilter}>
                      <SelectTrigger className="w-[160px] bg-white">
                        <SelectValue placeholder="Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white">
                        <Filter className="mr-2 h-4 w-4" />
                        More Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <div className="mb-2 space-y-1">
                          <label className="text-xs font-medium">Location</label>
                          <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                          </Select>
                        </div>
                        <div className="mb-2 space-y-1">
                          <label className="text-xs font-medium">Appointment Type</label>
                          <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              {appointmentTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="pt-2">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setStatusFilter("all")
                              setProviderFilter("all")
                              setLocationFilter("all")
                              setTypeFilter("all")
                              setSearchQuery("")
                            }}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>

            {/* Appointments View */}
            <motion.div variants={item} className="grid gap-4 lg:grid-cols-12">
              {/* Appointments List/Calendar */}
              <div className={`space-y-4 ${selectedAppointment ? "lg:col-span-7" : "lg:col-span-12"}`}>
                {viewMode === "list" ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Appointment List</CardTitle>
                        <div className="text-sm text-slate-500">
                          {filteredAppointments.length}{" "}
                          {filteredAppointments.length === 1 ? "appointment" : "appointments"} found
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {Object.keys(appointmentsByDate).length > 0 ? (
                        <div className="divide-y">
                          {Object.entries(appointmentsByDate)
                            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                            .map(([date, dateAppointments]) => (
                              <div key={date} className="space-y-2 p-4">
                                <h3 className="font-medium text-slate-900">
                                  {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                                </h3>
                                <div className="space-y-2">
                                  <AnimatePresence>
                                    {dateAppointments
                                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                      .map((appointment, index) => {
                                        return (
                                          <motion.div
                                            key={appointment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-slate-50 ${
                                              selectedAppointment === appointment.id ? "bg-blue-50 border-blue-200" : ""
                                            }`}
                                            onClick={() => setSelectedAppointment(appointment.id)}
                                          >
                                            <div className="flex items-start gap-3">
                                              <div
                                                className={`rounded-full p-2 ${
                                                  getAppointmentStatusStyles(appointment.status).bgColor
                                                } ${getAppointmentStatusStyles(appointment.status).textColor}`}
                                              >
                                                {getAppointmentStatusIcon(appointment.status)}
                                              </div>
                                              <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">
                                                      {formatTime(appointment.startTime)}
                                                    </h3>
                                                  </div>
                                                  <Badge
                                                    variant="outline"
                                                    className={`${
                                                      getAppointmentStatusStyles(appointment.status).badgeBgColor
                                                    } ${getAppointmentStatusStyles(appointment.status).badgeTextColor}`}
                                                  >
                                                    {formatStatus(appointment.status)}
                                                  </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Avatar className="h-6 w-6">
                                                    <AvatarImage
                                                      src={appointment.patient?.avatar || "/placeholder.svg"}
                                                      alt={appointment.patient?.name}
                                                    />
                                                    <AvatarFallback>
                                                      {(appointment.patient?.name ?? "?")
                                                        .split(" ")
                                                        .map((n) => n[0] ?? "?")
                                                        .join("")}
                                                    </AvatarFallback>
                                                  </Avatar>
                                                  <span className="font-medium">{appointment.patient?.name ?? "Unknown"}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                  <div className="flex items-center gap-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>{appointment.provider?.name}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span>{appointment.appointmentType}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span>{appointment.locationDetails?.name}</span>
                                                  </div>
                                                </div>
                                                {appointment.notes && (
                                                  <p className="line-clamp-1 text-sm text-slate-600">
                                                    {appointment.notes}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </motion.div>
                                        )
                                      })}
                                  </AnimatePresence>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="rounded-full bg-slate-100 p-3">
                            <Search className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium">No appointments found</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Try adjusting your search or filters to find what you're looking for.
                          </p>
                          <Button
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("")
                              setStatusFilter("all")
                              setProviderFilter("all")
                              setLocationFilter("all")
                              setTypeFilter("all")
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          {viewMode === "day"
                            ? format(selectedDate, "EEEE, MMMM d, yyyy")
                            : `${format(weekStartDate, "MMMM d")} - ${format(
                                addDays(weekStartDate, 6),
                                "MMMM d, yyyy",
                              )}`}
                        </CardTitle>
                        <div className="text-sm text-slate-500">
                          {filteredAppointments.length}{" "}
                          {filteredAppointments.length === 1 ? "appointment" : "appointments"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AppointmentCalendarView
                        appointments={filteredAppointments}
                        patients={[]}
                        providers={[]}
                        appointmentTypes={appointmentTypes}
                        selectedDate={selectedDate}
                        viewMode={viewMode}
                        weekStartDate={weekStartDate}
                        onSelectAppointment={setSelectedAppointment}
                        selectedAppointment={selectedAppointment}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Appointment Details */}
              {selectedAppointment && appointmentDetails && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                  <AppointmentDetails
                    appointment={appointmentDetails}
                    onClose={() => setSelectedAppointment(null)}
                    onCancel={handleCancelAppointment}
                    onRescheduleSuccess={handleAppointmentCreated}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* New Appointment Dialog */}
      <NewAppointmentDialog
        open={showNewAppointmentDialog}
        onOpenChange={setShowNewAppointmentDialog}
        appointmentTypes={appointmentTypes}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Cancel Appointment Confirmation Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        onConfirm={confirmCancelAppointment}
      />
    </div>
  )
}

// Helper functions
function formatTime(time: string) {
  try {
    // Parse the 24-hour time
    const [hours, minutes] = time.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    
    // Format to 12-hour time with AM/PM
    return format(date, "h:mm a")
  } catch (error) {
    console.error('Error formatting time:', error)
    return time
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "scheduled":
      return "Scheduled"
    case "confirmed":
      return "Confirmed"
    case "checked-in":
      return "Checked In"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

function getAppointmentStatusIcon(status: string) {
  switch (status) {
    case "scheduled":
      return <CalendarDays className="h-4 w-4" />
    case "confirmed":
      return <CalendarCheck className="h-4 w-4" />
    case "checked-in":
      return <CalendarClock className="h-4 w-4" />
    case "completed":
      return <CheckCircle2 className="h-4 w-4" />
    case "cancelled":
      return <CalendarX className="h-4 w-4" />
    default:
      return <CalendarIcon className="h-4 w-4" />
  }
}

function getAppointmentStatusStyles(status: string) {
  switch (status) {
    case "scheduled":
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        badgeBgColor: "bg-blue-50",
        badgeTextColor: "text-blue-700",
      }
    case "confirmed":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        badgeBgColor: "bg-green-50",
        badgeTextColor: "text-green-700",
      }
    case "checked-in":
      return {
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        badgeBgColor: "bg-purple-50",
        badgeTextColor: "text-purple-700",
      }
    case "completed":
      return {
        bgColor: "bg-cyan-100",
        textColor: "text-cyan-600",
        badgeBgColor: "bg-cyan-50",
        badgeTextColor: "text-cyan-700",
      }
    case "cancelled":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        badgeBgColor: "bg-red-50",
        badgeTextColor: "text-red-700",
      }
    default:
      return {
        bgColor: "bg-slate-100",
        textColor: "text-slate-600",
        badgeBgColor: "bg-slate-50",
        badgeTextColor: "text-slate-700",
      }
  }
}
