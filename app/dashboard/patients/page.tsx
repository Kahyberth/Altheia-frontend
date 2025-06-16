"use client"
// @ts-nocheck

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  SlidersHorizontal,
  Download,
  MoreHorizontal,
  Calendar,
  FileText,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { PatientAddDialog } from "@/components/patient-add-dialog"
import { PatientData, PatientPaginated } from "@/services/patients"
import { patientService } from "@/services/patients"
import { useAuth } from "@/context/AuthContext"
import { getClinicInformationByUser, getPatientsInClinic } from "@/services/clinic.service"
import { OwnerOnly } from "@/guard/RoleGuard"
import { appointmentService, Appointment } from "@/services/appointment.service"
import { medicalHistoryService, MedicalRecord, MedicalHistoryResponse } from "@/services/medical-history.service"

interface EnhancedPatient extends PatientData {
  conditions: string[];
  lastVisit: string;
  allergies: string[];
}

export default function PatientsPage() {
  const isMobile = useMobile()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false)
  const [patients, setPatients] = useState<EnhancedPatient[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof EnhancedPatient; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  })
  const [genderFilters, setGenderFilters] = useState<{ male: boolean; female: boolean }>({
    male: false,
    female: false,
  })
  const [ageRange, setAgeRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  })

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return
      try {
        
        const res = await getPatientsInClinic(user.clinic_id!)
        const mapped = (res.data || []).map((p: any) => {
          const dob = p.date_of_birth ? new Date(p.date_of_birth) : null
          const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : undefined
          return {
            id: p.id,
            user_id: p.user_id,
            name: p.user?.name || p.name,
            date_of_birth: p.date_of_birth,
            address: p.address,
            gender: p.user?.gender || p.gender,
            email: p.user?.email,
            phone: p.user?.phone,
            next_appointment: p.next_appointment || "-",
            eps: p.eps || "-",
            blood_type: p.blood_type,
            status: p.user.status,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            avatar: p.avatar || "/placeholder.svg",
            conditions: p.conditions || [],
            lastVisit: p.lastVisit || "-",
            insurance: p.insurance || "-",
            allergies: p.allergies || []
          }
        })
        setPatients(mapped)
      } catch (err) {
        console.error("Error fetching patients:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatients()
  }, [user])

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])


  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || (patient.status ? "active" : "inactive") === selectedStatus

    const matchesGender = 
      (!genderFilters.male && !genderFilters.female) || 
      (genderFilters.male && patient.gender.toLowerCase() === "male") ||
      (genderFilters.female && patient.gender.toLowerCase() === "female")

    const patientAge = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
    const matchesAgeRange =
      (!ageRange.min || patientAge >= parseInt(ageRange.min)) &&
      (!ageRange.max || patientAge <= parseInt(ageRange.max))

    return matchesSearch && matchesStatus && matchesGender && matchesAgeRange
  })


  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortConfig.key === 'name' || sortConfig.key === 'email' || sortConfig.key === 'id') {
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key])
    }
    
    if (sortConfig.key === 'date_of_birth') {
      const ageA = new Date().getFullYear() - new Date(a[sortConfig.key]).getFullYear()
      const ageB = new Date().getFullYear() - new Date(b[sortConfig.key]).getFullYear()
      return sortConfig.direction === 'asc' ? ageA - ageB : ageB - ageA
    }

    if (sortConfig.key === 'status') {
      return sortConfig.direction === 'asc'
        ? (a[sortConfig.key] === b[sortConfig.key] ? 0 : a[sortConfig.key] ? -1 : 1)
        : (a[sortConfig.key] === b[sortConfig.key] ? 0 : a[sortConfig.key] ? 1 : -1)
    }

    return 0
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

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
            <FileText className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Loading patient records...</p>
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

        {/* Patient Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <motion.div variants={item} className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight dark:text-white">Pacientes</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona y visualiza los registros de pacientes</p>
            </motion.div>

            {/* Patient Actions and Filters */}
            <motion.div variants={item}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search patients by name, ID, or email..."
                    className="w-full bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white pl-8 focus-visible:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="all" className="dark:text-white dark:focus:bg-slate-700">Todos los Estados</SelectItem>
                      <SelectItem value="active" className="dark:text-white dark:focus:bg-slate-700">Activo</SelectItem>
                      <SelectItem value="inactive" className="dark:text-white dark:focus:bg-slate-700">Inactivo</SelectItem>
                      <SelectItem value="critical" className="dark:text-white dark:focus:bg-slate-700">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700">
                        <Filter className="mr-2 h-4 w-4" />
                        Más Filtros
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 dark:bg-slate-800 dark:border-slate-700">
                      <DropdownMenuLabel className="dark:text-white">Filtrar Por</DropdownMenuLabel>
                      <DropdownMenuSeparator className="dark:bg-slate-600" />
                      <div className="p-2">
                        <div className="mb-2 space-y-1">
                          <label className="text-xs font-medium dark:text-white">Género</label>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="male" 
                              checked={genderFilters.male}
                              onCheckedChange={(checked) => 
                                setGenderFilters(prev => ({ ...prev, male: checked as boolean }))
                              }
                            />
                            <label htmlFor="male" className="text-sm">
                              Masculino
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="female" 
                              checked={genderFilters.female}
                              onCheckedChange={(checked) => 
                                setGenderFilters(prev => ({ ...prev, female: checked as boolean }))
                              }
                            />
                            <label htmlFor="female" className="text-sm">
                              Femenino
                            </label>
                          </div>
                        </div>
                        <div className="mb-2 space-y-1">
                          <label className="text-xs font-medium dark:text-white">Rango de Edad</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input 
                              type="number" 
                              placeholder="Min" 
                              className="h-8"
                              value={ageRange.min}
                              onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))}
                            />
                            <Input 
                              type="number" 
                              placeholder="Max" 
                              className="h-8"
                              value={ageRange.max}
                              onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setGenderFilters({ male: false, female: false })
                              setAgeRange({ min: "", max: "" })
                            }}
                          >
                            Limpiar Filtros
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex items-center gap-1 rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700 p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 dark:text-white"
                      onClick={() => setViewMode("grid")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-layout-grid"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8 dark:text-white"
                      onClick={() => setViewMode("list")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-list"
                      >
                        <line x1="8" x2="21" y1="6" y2="6" />
                        <line x1="8" x2="21" y1="12" y2="12" />
                        <line x1="8" x2="21" y1="18" y2="18" />
                        <line x1="3" x2="3.01" y1="6" y2="6" />
                        <line x1="3" x2="3.01" y1="12" y2="12" />
                        <line x1="3" x2="3.01" y1="18" y2="18" />
                      </svg>
                      <span className="sr-only">List view</span>
                    </Button>
                  </div>
                  <Button onClick={() => setShowAddPatientDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Paciente
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Patient Results */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Mostrando <span className="font-medium">{filteredPatients.length}</span> pacientes
                </p>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1 bg-white">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>Ordenar</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ordenar Por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setSortConfig({ key: 'name', direction: 'asc' })}
                        className={sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'bg-slate-100' : ''}
                      >
                        Nombre (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortConfig({ key: 'name', direction: 'desc' })}
                        className={sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'bg-slate-100' : ''}
                      >
                        Nombre (Z-A)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortConfig({ key: 'date_of_birth', direction: 'asc' })}
                        className={sortConfig.key === 'date_of_birth' && sortConfig.direction === 'asc' ? 'bg-slate-100' : ''}
                      >
                          Edad (Más Joven)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortConfig({ key: 'date_of_birth', direction: 'desc' })}
                        className={sortConfig.key === 'date_of_birth' && sortConfig.direction === 'desc' ? 'bg-slate-100' : ''}
                      >
                        Edad (Más Viejo)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortConfig({ key: 'status', direction: 'asc' })}
                        className={sortConfig.key === 'status' && sortConfig.direction === 'asc' ? 'bg-slate-100' : ''}
                      >
                        Estado (Activo primero)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortConfig({ key: 'status', direction: 'desc' })}
                        className={sortConfig.key === 'status' && sortConfig.direction === 'desc' ? 'bg-slate-100' : ''}
                      >
                        Estado (Inactivo primero)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={async () => {
                        try {
                          const blob = await patientService.exportAllPatients();
                          if (!blob || blob.size === 0) {
                            throw new Error('No data received from server');
                          }
                          console.log(blob);
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'all-patients.xlsx';
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error('Export failed:', error);
                          
                          alert('Error al exportar los pacientes. Por favor, intente nuevamente.');
                        }
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Todos los Pacientes</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        try {
                          const blob = await patientService.exportSelectedPatients(
                            sortedPatients.map(patient => patient.id)
                          );
                          if (!blob || blob.size === 0) {
                            throw new Error('No data received from server');
                          }
                          const url = window.URL.createObjectURL(new Blob([blob], { 
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                          }));
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'selected-patients.xlsx';
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error('Export failed:', error);
                          alert('Error al exportar los pacientes seleccionados. Por favor, intente nuevamente.');
                        }
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Pacientes Filtrados</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>

            {/* Patient Grid/List */}
            {viewMode === "grid" ? (
              <motion.div
                variants={item}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {sortedPatients.map((patient) => (
                  <motion.div key={patient.id} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
                    <Card
                      className={`h-full cursor-pointer overflow-hidden transition-all hover:shadow-md dark:bg-slate-800 dark:border-slate-700 dark:hover:shadow-slate-700/50 ${
                        selectedPatient === patient.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <div
                            className={`absolute inset-0 bg-gradient-to-b ${
                              patient.status
                                ? "from-blue-500/20 to-blue-600/20"
                                : "from-slate-400/20 to-slate-500/20"
                            }`}
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <Badge
                                variant={patient.status ? "outline" : "secondary"}
                                className={
                                  patient.status
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                                }
                              >
                                {patient.status ? "active" : "inactive"}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-white dark:hover:bg-slate-700">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Más opciones</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="dark:bg-slate-800 dark:border-slate-700">
                                  <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Ver detalles</DropdownMenuItem>
                                  <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Editar paciente</DropdownMenuItem>
                                  <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Programar cita</DropdownMenuItem>
                                  <DropdownMenuSeparator className="dark:bg-slate-600" />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:focus:bg-slate-700">Archivar paciente</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="flex flex-col items-center p-4 pt-0 text-center">
                            <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-700 shadow">
                              <AvatarImage src={patient.name.split(" ")[0].toUpperCase()} alt={patient.name} />
                              <AvatarFallback className="dark:bg-slate-700 dark:text-white">
                                {patient.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="mt-3 text-lg font-semibold dark:text-white">{patient.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years • {patient.gender}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">{patient.id}</p>
                          </div>
                        </div>
                        <div className="border-t dark:border-slate-700 p-4">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-start gap-2">
                              <Mail className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                              <span className="text-xs dark:text-slate-300">{patient.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                              <span className="text-xs dark:text-slate-300">{patient.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                              <div className="flex flex-col">
                                <span className="text-xs dark:text-slate-300">Siguiente Cita</span>
                                <span className="text-xs font-medium dark:text-slate-200">
                                  {patient.next_appointment ? new Date(patient.next_appointment).toLocaleDateString() : "No upcoming appointments"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {patient.conditions && patient.conditions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {patient.conditions.map((condition: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-slate-100 text-xs dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div variants={item} className="overflow-hidden rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50 dark:bg-slate-700 dark:border-slate-600">
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Patient</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Last Visit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Next Appointment</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPatients.map((patient, index) => (
                        <motion.tr
                          key={patient.id}
                          className={`border-b transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 ${
                            selectedPatient === patient.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
                          onClick={() => setSelectedPatient(patient.id)}
                          whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={patient.name.split(" ")[0].toUpperCase()} alt={patient.name} />
                                <AvatarFallback className="dark:bg-slate-700 dark:text-white">
                                  {patient.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium dark:text-white">{patient.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years • {patient.gender}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm dark:text-slate-300">{patient.id}</td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="text-sm dark:text-slate-300">{patient.email}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{patient.phone}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <Badge
                              variant={patient.status ? "outline" : "secondary"}
                              className={
                                patient.status
                                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                              }
                            >
                              {patient.status ? "active" : "inactive"}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm dark:text-slate-300">
                            {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "No visits yet"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm dark:text-slate-300">
                            {patient.next_appointment ? new Date(patient.next_appointment).toLocaleDateString() : "No upcoming appointments"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-white dark:hover:bg-slate-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Más opciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-slate-800 dark:border-slate-700">
                                <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Ver detalles</DropdownMenuItem>
                                <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Editar paciente</DropdownMenuItem>
                                <DropdownMenuItem className="dark:text-white dark:focus:bg-slate-700">Agendar cita</DropdownMenuItem>
                                <DropdownMenuSeparator className="dark:bg-slate-600" />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {filteredPatients.length === 0 && (
              <motion.div
                variants={item}
                className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white dark:bg-slate-800 dark:border-slate-700 p-8 text-center"
              >
                <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-3">
                  <Search className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium dark:text-white">No se encontraron pacientes</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  No se encontraron pacientes que coincidan con los criterios de búsqueda.
                </p>
                <Button className="mt-4" onClick={() => {
                  setSearchQuery("")
                  setGenderFilters({ male: false, female: false })
                  setSelectedStatus("all")
                  setViewMode("grid")
                }}>
                  Limpiar filtros
                </Button>
              </motion.div>
            )}
          </motion.div>
        </main>

        {/* Patient Detail View */}
        {selectedPatient && (
          <PatientDetailView
            patient={patients.find((p) => p.id === selectedPatient)!}
            onClose={() => setSelectedPatient(null)}
          />
        )}

        {/* Add Patient Dialog */}
        <PatientAddDialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog} />
      </div>
    </div>
  )
}

interface PatientDetailViewProps {
  patient: EnhancedPatient;
  onClose: () => void;
}

function PatientDetailView({ patient, onClose }: PatientDetailViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryResponse | null>(null)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patient.user_id || !patient.id) return

      try {
        // Fetch appointments
        setIsLoadingAppointments(true)
        const appointmentsData = await appointmentService.getAppointmentsByUserId(patient.user_id)
        setAppointments(appointmentsData)
      } catch (error) {
        console.error('Error fetching patient appointments:', error)
      } finally {
        setIsLoadingAppointments(false)
      }

      try {
        // Fetch medical history
        setIsLoadingHistory(true)
        const historyData = await medicalHistoryService.getPatientMedicalHistory(patient.id)
        setMedicalHistory(historyData)
      } catch (error) {
        console.error('Error fetching patient medical history:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchPatientData()
  }, [patient.user_id, patient.id])

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date_time)
    const now = new Date()
    return appointmentDate > now && appointment.status !== 'cancelled'
  })

  // Filter past appointments
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date_time)
    const now = new Date()
    return appointmentDate <= now && appointment.status !== 'cancelled'
  })

  // Get current medications from medical history
  const currentMedications = medicalHistory?.data.medicalRecords
    .filter(record => record.type === 'medications' && record.status === 'active')
    .flatMap(record => record.content.medications || []) || []

  // Get medical conditions from history records
  const medicalConditions = medicalHistory?.data.medicalRecords
    .filter(record => record.type === 'diagnoses' && record.content.diagnosis)
    .map(record => record.content.diagnosis!)
    .filter(diagnosis => diagnosis && diagnosis.trim() !== '') || []

  // Get allergies from medical history
  const allergies = medicalHistory?.data.medicalRecords
    .filter(record => record.content.allergies)
    .map(record => record.content.allergies!)
    .filter(allergy => allergy && allergy.trim() !== '') || []

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white md:inset-auto md:right-0 md:top-0 md:h-screen md:w-[600px] md:border-l"
    >
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Detalles del Paciente</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow">
            <AvatarImage src={patient.name.split(" ")[0].toUpperCase()} alt={patient.name} />
            <AvatarFallback className="dark:bg-slate-700 dark:text-white">
              {patient.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold">{patient.name}</h1>
          <p className="text-slate-500">
            {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years • {patient.gender} • {patient.blood_type}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant={patient.status ? "outline" : "secondary"}
              className={
                patient.status
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-100 hover:text-slate-700"
              }
            >
              {patient.status ? "active" : "inactive"}
            </Badge>
            <span className="text-sm text-slate-500">Patient ID: {patient.id}</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-2 font-medium">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-slate-400"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{patient.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>

        <Tabs defaultValue="medical">
          <TabsList className="w-full">
            <TabsTrigger value="medical" className="flex-1">
              Historial Médico
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1">
              Citas
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex-1">
              Medicamentos
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="medical">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Condiciones</h3>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingHistory ? (
                        <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
                      ) : medicalConditions.length > 0 ? (
                        medicalConditions.map((condition, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {condition}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No se han registrado condiciones</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Alergias</h3>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingHistory ? (
                        <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
                      ) : allergies.length > 0 ? (
                        allergies.map((allergy, index: number) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No se han registrado alergias</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Visitas Recientes</h3>
                    <div className="space-y-3">
                      {isLoadingHistory ? (
                        Array.from({ length: 2 }).map((_, index) => (
                          <div key={index} className="rounded-lg border p-3">
                            <div className="h-4 w-full bg-slate-200 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-3/4 bg-slate-200 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-full bg-slate-200 animate-pulse rounded"></div>
                          </div>
                        ))
                      ) : medicalHistory?.data.medicalRecords
                          .filter(record => record.type === 'diagnoses' && record.status === 'completed')
                          .slice(0, 5)
                          .map((visit, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-slate-400" />
                                  <span className="font-medium">
                                    {new Date(visit.date).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <Badge variant="outline" className="bg-slate-50">
                                  {visit.content.consult_reason || "Consulta médica"}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-slate-500">Proveedor: {visit.provider}</p>
                              <p className="mt-2 text-sm">{visit.content.description || visit.content.notes}</p>
                            </div>
                          )) || (
                          <div className="text-sm text-slate-500">
                            No se han registrado visitas recientes
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Próximas Citas</h3>
                  </div>

                  <div className="space-y-3">
                    {isLoadingAppointments ? (
                      Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="rounded-lg border p-3">
                          <div className="h-4 w-full bg-slate-200 animate-pulse rounded mb-2"></div>
                          <div className="h-3 w-3/4 bg-slate-200 animate-pulse rounded mb-2"></div>
                          <div className="h-3 w-full bg-slate-200 animate-pulse rounded"></div>
                        </div>
                      ))
                    ) : upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment, index) => (
                        <div key={index} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-blue-100 p-1.5">
                                <Calendar className="h-3.5 w-3.5 text-blue-700" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {new Date(appointment.date_time).toLocaleDateString("es-ES", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(appointment.date_time).toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })} • {appointment.reason}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-slate-500"
                                >
                                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6h3.8a2 2 0 0 1 2 2v2.4Z" />
                                  <path d="M12 9v6" />
                                  <path d="m15 12-3 3-3-3" />
                                </svg>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-slate-500"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
                                <path d="M1 5h22" />
                                <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" />
                                <path d="M10 16h4" />
                              </svg>
                              <span>{appointment.physician_name}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{appointment.clinic_name}</span>
                            </div>
                          </div>
                        </div>
                      ))
                                         ) : (
                       <div className="text-sm text-slate-500">
                         No hay próximas citas programadas
                       </div>
                     )}
                  </div>

                  <div className="mt-4">
                    <h3 className="mb-2 font-medium">Citas Pasadas</h3>
                    <div className="space-y-3">
                      {isLoadingAppointments ? (
                        Array.from({ length: 2 }).map((_, index) => (
                          <div key={index} className="rounded-lg border p-3">
                            <div className="h-4 w-full bg-slate-200 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-3/4 bg-slate-200 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-full bg-slate-200 animate-pulse rounded"></div>
                          </div>
                        ))
                      ) : pastAppointments.length > 0 ? (
                        pastAppointments.slice(0, 5).map((appointment, index) => (
                          <div key={index} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-slate-100 p-1.5">
                                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {new Date(appointment.date_time).toLocaleDateString("es-ES", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(appointment.date_time).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })} • {appointment.reason}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {appointment.status === 'completed' ? 'Completada' : 'Finalizada'}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
                                  <path d="M1 5h22" />
                                  <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" />
                                  <path d="M10 16h4" />
                                </svg>
                                <span>{appointment.physician_name}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{appointment.clinic_name}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">
                          No hay citas pasadas registradas
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Medicamentos Actuales</h3>
                  </div>

                  <div className="space-y-3">
                    {isLoadingHistory ? (
                      Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="rounded-lg border p-3">
                          <div className="h-4 w-full bg-slate-200 animate-pulse rounded mb-2"></div>
                          <div className="h-3 w-3/4 bg-slate-200 animate-pulse rounded mb-2"></div>
                          <div className="h-3 w-full bg-slate-200 animate-pulse rounded"></div>
                        </div>
                      ))
                    ) : currentMedications.length > 0 ? (
                      currentMedications.map((medication, index) => (
                        <div key={index} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{medication.name}</p>
                              <p className="text-xs text-slate-500">
                                {medication.dosage} • {medication.frequency}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-slate-500"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-red-500"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Iniciado: {new Date(medication.startDate).toLocaleDateString("es-ES")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
                                <path d="M1 5h22" />
                                <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" />
                                <path d="M10 16h4" />
                              </svg>
                              <span>{medication.prescriber}</span>
                            </div>
                          </div>
                          {medication.instructions && (
                            <div className="mt-2 flex items-start gap-1 text-xs">
                              <AlertCircle className="mt-0.5 h-3 w-3 text-amber-500" />
                              <span>{medication.instructions}</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed p-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
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
                            className="text-slate-400"
                          >
                            <path d="m9 12 2 2 4-4" />
                            <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
                            <path d="M22 19H2" />
                            <path d="M11 3h2" />
                            <path d="M14 7h-4" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium">No se han registrado medicamentos</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Este paciente no está tomando ningún medicamento.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="mb-2 font-medium">Historial de Medicamentos</h3>
                    <div className="space-y-3">
                      {isLoadingHistory ? (
                        <div className="rounded-lg border p-3">
                          <div className="h-4 w-full bg-slate-200 animate-pulse rounded mb-2"></div>
                          <div className="h-3 w-3/4 bg-slate-200 animate-pulse rounded mb-2"></div>
                          <div className="h-3 w-full bg-slate-200 animate-pulse rounded"></div>
                        </div>
                      ) : (medicalHistory?.data?.medicalRecords || [])
                          .filter(record => record.type === 'medications' && record.status === 'completed')
                          .flatMap(record => record.content.medications || [])
                          .length > 0 ? (
                        (medicalHistory?.data?.medicalRecords || [])
                          .filter(record => record.type === 'medications' && record.status === 'completed')
                          .flatMap(record => record.content.medications || [])
                          .map((medication, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{medication.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {medication.dosage} • {medication.frequency}
                                  </p>
                                </div>
                                <Badge variant="outline" className="bg-slate-50">
                                  Completado
                                </Badge>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {new Date(medication.startDate).toLocaleDateString("es-ES")} - {medication.duration}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
                                    <path d="M1 5h22" />
                                    <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" />
                                    <path d="M10 16h4" />
                                  </svg>
                                  <span>{medication.prescriber}</span>
                                </div>
                              </div>
                              {medication.instructions && (
                                <div className="mt-2 flex items-start gap-1 text-xs">
                                  <AlertCircle className="mt-0.5 h-3 w-3 text-slate-400" />
                                  <span>Instrucciones: {medication.instructions}</span>
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="text-sm text-slate-500">
                          No hay historial de medicamentos disponible
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        <OwnerOnly>
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar Paciente
          </Button>
        </OwnerOnly>
      </div>
    </motion.div>
  )
}
