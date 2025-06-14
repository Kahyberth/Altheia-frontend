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
import { physicianService } from "@/services/physician"

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

// Sample appointment locations
const appointmentLocations = [
  { id: "main-clinic", name: "Main Clinic", address: "123 Medical Center Dr, Suite 100" },
  { id: "north-branch", name: "North Branch", address: "456 Health Parkway, Building B" },
  { id: "south-branch", name: "South Branch", address: "789 Wellness Blvd, Suite 200" },
  { id: "virtual", name: "Virtual Visit", address: "Online" },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch physicians
        const physicians = await physicianService.getAllPhysicians()
        const transformedPhysicians = physicians.map((physician) => ({
          id: physician.physician_id,
          name: physician.name,
          specialty: physician.physician_specialty,
          avatar: "/placeholder.svg?height=128&width=128&text=" + physician.name.split(" ").map(n => n[0]).join(""),
        }))
        setProviders(transformedPhysicians)

        // Fetch appointments for the first physician (you might want to change this based on your requirements)
        if (transformedPhysicians.length > 0) {
          const backendAppointments = await appointmentService.getAppointmentsByPhysicianId(transformedPhysicians[0].id)
          const transformedAppointments = backendAppointments.map((apt: BackendAppointment) => {
            const dateTime = new Date(apt.date_time)
            // Calculate age from date_of_birth, safely
            const birthDate = apt.patient?.date_of_birth ? new Date(apt.patient.date_of_birth) : null;
            const age = birthDate
              ? Math.floor((new Date().getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
              : 0;
            
            return {
              id: apt.id,
              patientId: apt.patient_id,
              providerId: apt.physician_id,
              date: format(dateTime, "yyyy-MM-dd"),
              startTime: format(dateTime, "HH:mm"),
              appointmentType: apt.reason,
              status: mapBackendStatus(apt.status),
              notes: "Faltan agregar al json",
              createdAt: apt.createdAt,
              updatedAt: apt.updatedAt,
              patient: apt.patient
                ? {
                    id: apt.patient.id,
                    name: apt.patient_name,
                    age: age,
                    gender: apt.patient_gender,
                    email: apt.patient_email,
                    phone: apt.patient_phone,
                    avatar: "/placeholder.svg?height=128&width=128&text=" + apt.patient_name.split(" ").map(n => n[0]).join(""),
                  }
                : undefined,
              provider: apt.physician
                ? {
                    id: apt.physician.id,
                    name: apt.physician_name,
                    specialty: apt.physician.physician_specialty,
                    avatar: "/placeholder.svg?height=128&width=128&text=" + apt.physician_name.split(" ").map(n => n[0]).join(""),
                  }
                : undefined,
              locationDetails: {
                id: apt.clinic_id,
                name: apt.clinic_name,
                address: apt.clinic_address,
              },
            }
          })
          setAppointments(transformedAppointments)
          console.log("TRANSFORMED APPOINTMENTS", transformedAppointments)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
    // Refresh appointments for the current physician
    if (providers.length > 0) {
      try {
        const backendAppointments = await appointmentService.getAppointmentsByPhysicianId(providers[0].id)
        console.log('Fetched appointments:', backendAppointments)
        
        const transformedAppointments = backendAppointments.map((apt: BackendAppointment) => {
          // Parse the date and time while preserving the timezone
          const [datePart, timePart] = apt.date_time.split('T')
          const [year, month, day] = datePart.split('-').map(Number)
          const [hours, minutes] = timePart.split(':').map(Number)
          
          // Create date object with explicit timezone handling
          const dateTime = new Date(year, month - 1, day, hours, minutes)
          console.log('Processing appointment:', {
            id: apt.id,
            originalDateTime: apt.date_time,
            parsedDateTime: dateTime,
            formattedDate: format(dateTime, "yyyy-MM-dd"),
            formattedTime: format(dateTime, "HH:mm"),
            hours: hours,
            minutes: minutes
          })
          
          // Calculate age from date_of_birth, safely
          const birthDate = apt.patient?.date_of_birth ? new Date(apt.patient.date_of_birth) : null;
          const age = birthDate
            ? Math.floor((new Date().getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
            : 0;
          
          const transformed = {
            id: apt.id,
            patientId: apt.patient_id,
            providerId: apt.physician_id,
            date: format(dateTime, "yyyy-MM-dd"),
            startTime: format(dateTime, "HH:mm"), // Keep 24-hour format for internal use
            appointmentType: apt.reason,
            status: mapBackendStatus(apt.status),
            notes: apt.reason,
            createdAt: apt.createdAt,
            updatedAt: apt.updatedAt,
            patient: apt.patient
              ? {
                  id: apt.patient.id,
                  name: apt.patient_name,
                  age: age,
                  gender: apt.patient_gender,
                  email: apt.patient_email,
                  phone: apt.patient_phone,
                  avatar: "/placeholder.svg?height=128&width=128&text=" + apt.patient_name.split(" ").map(n => n[0]).join(""),
                }
              : undefined,
            provider: apt.physician
              ? {
                  id: apt.physician.id,
                  name: apt.physician_name,
                  specialty: apt.physician.physician_specialty,
                  avatar: "/placeholder.svg?height=128&width=128&text=" + apt.physician_name.split(" ").map(n => n[0]).join(""),
                }
              : undefined,
            locationDetails: {
              id: apt.clinic_id,
              name: apt.clinic_name,
              address: apt.clinic_address,
            },
          }
          console.log('Transformed appointment:', transformed)
          return transformed
        })
        
        console.log('Setting appointments:', transformedAppointments)
        setAppointments(transformedAppointments)
      } catch (error) {
        console.error('Error refreshing appointments:', error)
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
              <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
              <p className="text-sm text-slate-500">Manage and schedule patient appointments</p>
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
                        New Appointment
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
                    placeholder="Search appointments by patient, provider, or notes..."
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
                            <SelectContent>
                              <SelectItem value="all">All Locations</SelectItem>
                              {appointmentLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
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
                        appointmentLocations={appointmentLocations}
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
        appointmentLocations={appointmentLocations}
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
