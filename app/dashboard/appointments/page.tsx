"use client"

import { useState, useEffect, useMemo } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { format, addDays, startOfWeek, endOfWeek, parseISO, addWeeks } from "date-fns"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { AppointmentDetails } from "@/components/appointment-details"
import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { AppointmentCalendarView } from "@/components/appointment-calendar-view"
import { getAppointments } from "@/services/appointments"

// Sample patient data
const patients = [
  {
    id: "P-1001",
    name: "Sarah Johnson",
    age: 42,
    gender: "Female",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    avatar: "/placeholder.svg?height=128&width=128&text=SJ",
  },
  {
    id: "P-1002",
    name: "Michael Chen",
    age: 35,
    gender: "Male",
    email: "michael.chen@example.com",
    phone: "(555) 987-6543",
    avatar: "/placeholder.svg?height=128&width=128&text=MC",
  },
  {
    id: "P-1003",
    name: "Amanda Rodriguez",
    age: 28,
    gender: "Female",
    email: "amanda.rodriguez@example.com",
    phone: "(555) 456-7890",
    avatar: "/placeholder.svg?height=128&width=128&text=AR",
  },
  {
    id: "P-1004",
    name: "David Wilson",
    age: 65,
    gender: "Male",
    email: "david.wilson@example.com",
    phone: "(555) 789-0123",
    avatar: "/placeholder.svg?height=128&width=128&text=DW",
  },
  {
    id: "P-1005",
    name: "Emily Thompson",
    age: 31,
    gender: "Female",
    email: "emily.thompson@example.com",
    phone: "(555) 234-5678",
    avatar: "/placeholder.svg?height=128&width=128&text=ET",
  },
]

// Sample provider data
const providers = [
  {
    id: "DR-1001",
    name: "Dr. Rebecca Taylor",
    specialty: "Cardiologist",
    avatar: "/placeholder.svg?height=128&width=128&text=RT",
  },
  {
    id: "DR-1002",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    avatar: "/placeholder.svg?height=128&width=128&text=JW",
  },
  {
    id: "DR-1003",
    name: "Dr. Maria Garcia",
    specialty: "Pediatrician",
    avatar: "/placeholder.svg?height=128&width=128&text=MG",
  },
  {
    id: "DR-1004",
    name: "Dr. Robert Johnson",
    specialty: "Orthopedic Surgeon",
    avatar: "/placeholder.svg?height=128&width=128&text=RJ",
  },
  {
    id: "DR-1005",
    name: "Dr. Lisa Chen",
    specialty: "Dermatologist",
    avatar: "/placeholder.svg?height=128&width=128&text=LC",
  },
]

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

// Sample appointment data
const appointments = [
  {
    id: "APT-1001",
    patientId: "P-1001",
    providerId: "DR-1001",
    date: "2025-05-20",
    startTime: "09:00",
    endTime: "09:30",
    type: "check-up",
    status: "scheduled",
    location: "main-clinic",
    notes: "Annual physical examination",
    isVirtual: false,
    createdAt: "2025-05-01T10:15:00",
    updatedAt: "2025-05-01T10:15:00",
  },
  {
    id: "APT-1002",
    patientId: "P-1002",
    providerId: "DR-1002",
    date: "2025-05-20",
    startTime: "10:30",
    endTime: "11:15",
    type: "consultation",
    status: "confirmed",
    location: "north-branch",
    notes: "Initial consultation for headaches",
    isVirtual: false,
    createdAt: "2025-05-02T14:30:00",
    updatedAt: "2025-05-10T09:45:00",
  },
  {
    id: "APT-1003",
    patientId: "P-1003",
    providerId: "DR-1003",
    date: "2025-05-20",
    startTime: "13:15",
    endTime: "13:45",
    type: "follow-up",
    status: "checked-in",
    location: "main-clinic",
    notes: "Follow-up for medication adjustment",
    isVirtual: false,
    createdAt: "2025-05-05T11:20:00",
    updatedAt: "2025-05-20T13:00:00",
  },
  {
    id: "APT-1004",
    patientId: "P-1004",
    providerId: "DR-1004",
    date: "2025-05-20",
    startTime: "15:00",
    endTime: "16:00",
    type: "procedure",
    status: "completed",
    location: "south-branch",
    notes: "Knee injection procedure",
    isVirtual: false,
    createdAt: "2025-05-03T09:10:00",
    updatedAt: "2025-05-20T16:15:00",
  },
  {
    id: "APT-1005",
    patientId: "P-1005",
    providerId: "DR-1005",
    date: "2025-05-20",
    startTime: "16:30",
    endTime: "17:00",
    type: "follow-up",
    status: "cancelled",
    location: "virtual",
    notes: "Patient requested cancellation",
    isVirtual: true,
    createdAt: "2025-05-04T15:45:00",
    updatedAt: "2025-05-18T10:30:00",
  },
  {
    id: "APT-1006",
    patientId: "P-1001",
    providerId: "DR-1001",
    date: "2025-05-21",
    startTime: "11:00",
    endTime: "11:30",
    type: "follow-up",
    status: "scheduled",
    location: "main-clinic",
    notes: "Blood pressure check",
    isVirtual: false,
    createdAt: "2025-05-07T13:20:00",
    updatedAt: "2025-05-07T13:20:00",
  },
  {
    id: "APT-1007",
    patientId: "P-1002",
    providerId: "DR-1002",
    date: "2025-05-21",
    startTime: "14:00",
    endTime: "14:45",
    type: "consultation",
    status: "confirmed",
    location: "virtual",
    notes: "Virtual follow-up for test results",
    isVirtual: true,
    createdAt: "2025-05-08T09:30:00",
    updatedAt: "2025-05-15T11:45:00",
  },
  {
    id: "APT-1008",
    patientId: "P-1003",
    providerId: "DR-1003",
    date: "2025-05-22",
    startTime: "09:30",
    endTime: "10:00",
    type: "follow-up",
    status: "scheduled",
    location: "south-branch",
    notes: "Medication review",
    isVirtual: false,
    createdAt: "2025-05-09T16:15:00",
    updatedAt: "2025-05-09T16:15:00",
  },
  {
    id: "APT-1009",
    patientId: "P-1004",
    providerId: "DR-1004",
    date: "2025-05-22",
    startTime: "13:00",
    endTime: "14:00",
    type: "procedure",
    status: "confirmed",
    location: "main-clinic",
    notes: "Pre-operative assessment",
    isVirtual: false,
    createdAt: "2025-05-10T10:45:00",
    updatedAt: "2025-05-17T14:30:00",
  },
  {
    id: "APT-1010",
    patientId: "P-1005",
    providerId: "DR-1005",
    date: "2025-05-23",
    startTime: "10:15",
    endTime: "10:45",
    type: "follow-up",
    status: "scheduled",
    location: "north-branch",
    notes: "Skin condition follow-up",
    isVirtual: false,
    createdAt: "2025-05-11T13:10:00",
    updatedAt: "2025-05-11T13:10:00",
  },
  {
    id: "APT-1011",
    patientId: "P-1001",
    providerId: "DR-1003",
    date: "2025-05-23",
    startTime: "15:30",
    endTime: "16:00",
    type: "vaccination",
    status: "scheduled",
    location: "main-clinic",
    notes: "Flu vaccination",
    isVirtual: false,
    createdAt: "2025-05-12T11:25:00",
    updatedAt: "2025-05-12T11:25:00",
  },
  {
    id: "APT-1012",
    patientId: "P-1002",
    providerId: "DR-1002",
    date: "2025-05-24",
    startTime: "09:00",
    endTime: "09:45",
    type: "consultation",
    status: "scheduled",
    location: "virtual",
    notes: "Virtual consultation for headache follow-up",
    isVirtual: true,
    createdAt: "2025-05-13T15:40:00",
    updatedAt: "2025-05-13T15:40:00",
  },
]

// Sample audit trail entries
const auditTrail = [
  {
    id: "AUD-1001",
    appointmentId: "APT-1002",
    action: "status_update",
    user: "Dr. Rebecca Taylor",
    timestamp: "2025-05-10T09:45:00",
    details: "Updated status from 'scheduled' to 'confirmed'",
    previousValue: "scheduled",
    newValue: "confirmed",
  },
  {
    id: "AUD-1002",
    appointmentId: "APT-1003",
    action: "status_update",
    user: "Nurse Johnson",
    timestamp: "2025-05-20T13:00:00",
    details: "Updated status from 'confirmed' to 'checked-in'",
    previousValue: "confirmed",
    newValue: "checked-in",
  },
  {
    id: "AUD-1003",
    appointmentId: "APT-1004",
    action: "status_update",
    user: "Dr. Robert Johnson",
    timestamp: "2025-05-20T16:15:00",
    details: "Updated status from 'checked-in' to 'completed'",
    previousValue: "checked-in",
    newValue: "completed",
  },
  {
    id: "AUD-1004",
    appointmentId: "APT-1005",
    action: "status_update",
    user: "Admin Staff",
    timestamp: "2025-05-18T10:30:00",
    details: "Updated status from 'confirmed' to 'cancelled'",
    previousValue: "confirmed",
    newValue: "cancelled",
  },
  {
    id: "AUD-1005",
    appointmentId: "APT-1007",
    action: "status_update",
    user: "Dr. James Wilson",
    timestamp: "2025-05-15T11:45:00",
    details: "Updated status from 'scheduled' to 'confirmed'",
    previousValue: "scheduled",
    newValue: "confirmed",
  },
]

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




  useEffect(() => {
    getAppointments().then((res) => {
      console.log(res)
    })
  }, [])

  // Get appointment details
  const appointmentDetails = useMemo(() => {
    if (!selectedAppointment) return null
    const appointment = appointments.find((apt) => apt.id === selectedAppointment)
    if (!appointment) return null

    const patient = patients.find((p) => p.id === appointment.patientId)
    const provider = providers.find((p) => p.id === appointment.providerId)
    const type = appointmentTypes.find((t) => t.id === appointment.type)
    const location = appointmentLocations.find((l) => l.id === appointment.location)
    const audit = auditTrail.filter((a) => a.appointmentId === appointment.id)

    return {
      ...appointment,
      patient,
      provider,
      type,
      location,
      audit,
    }
  }, [selectedAppointment])

  // Filter appointments based on selected date, search query, and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Filter by date based on view mode
      if (viewMode === "day") {
        if (appointment.date !== format(selectedDate, "yyyy-MM-dd")) return false
      } else if (viewMode === "week") {
        const appointmentDate = parseISO(appointment.date)
        const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 })
        if (appointmentDate < weekStart || appointmentDate > weekEnd) return false
      }

      // Filter by search query
      if (searchQuery) {
        const patient = patients.find((p) => p.id === appointment.patientId)
        const provider = providers.find((p) => p.id === appointment.providerId)
        const searchLower = searchQuery.toLowerCase()

        const matchesPatient = patient?.name.toLowerCase().includes(searchLower)
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
      if (locationFilter !== "all" && appointment.location !== locationFilter) return false

      // Filter by type
      if (typeFilter !== "all" && appointment.type !== typeFilter) return false

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
    const grouped: Record<string, typeof appointments> = {}
    filteredAppointments.forEach((appointment) => {
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
    // In a real app, this would call an API to update the appointment status
    console.log(`Cancelling appointment ${appointmentToCancel}`)
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
            <CalendarIcon className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600">Loading appointments...</p>
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
                                        const patient = patients.find((p) => p.id === appointment.patientId)
                                        const provider = providers.find((p) => p.id === appointment.providerId)
                                        const type = appointmentTypes.find((t) => t.id === appointment.type)
                                        const location = appointmentLocations.find((l) => l.id === appointment.location)

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
                                                      {formatTime(appointment.startTime)} -{" "}
                                                      {formatTime(appointment.endTime)}
                                                    </h3>
                                                    {appointment.isVirtual && (
                                                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                        <Video className="mr-1 h-3 w-3" />
                                                        Virtual
                                                      </Badge>
                                                    )}
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
                                                      src={patient?.avatar || "/placeholder.svg"}
                                                      alt={patient?.name}
                                                    />
                                                    <AvatarFallback>
                                                      {patient?.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                    </AvatarFallback>
                                                  </Avatar>
                                                  <span className="font-medium">{patient?.name}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                  <div className="flex items-center gap-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>{provider?.name}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span>{type?.name}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span>{location?.name}</span>
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
                        patients={patients}
                        providers={providers}
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
        patients={patients}
        providers={providers}
        appointmentTypes={appointmentTypes}
        appointmentLocations={appointmentLocations}
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
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12
  return `${formattedHour}:${minutes} ${ampm}`
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
