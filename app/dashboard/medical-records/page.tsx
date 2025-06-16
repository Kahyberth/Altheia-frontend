"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Download,
  Printer,
  Share2,
  X,
  Eye,
  Lock,
  Shield,
  User,
  Clipboard,
  Microscope,
  Stethoscope,
  Activity,
  Pill,
  Zap,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Users,
  MapPin,
  TrendingUp,
  BarChart3,
  FileSearch,
  Sparkles,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Bookmark,
  Tag,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { useRole } from "@/hooks/useRole"
import { RoleGuard } from "@/guard/RoleGuard"
import { UserRole } from "@/types/auth"
import {
  medicalHistoryService,
  type MedicalHistoryResponse,
  type ClinicMedicalHistoryResponse,
  type MedicalRecord,
  type PatientMedicalInfo,
} from "@/services/medical-history.service"

// Enhanced record type configurations with better visual hierarchy
const recordTypes = {
  diagnoses: {
    name: "Diagnósticos",
    icon: Stethoscope,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    lightColor: "bg-red-100",
    priority: "high",
  },
  medications: {
    name: "Medicamentos",
    icon: Pill,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    lightColor: "bg-emerald-100",
    priority: "high",
  },
  lab_results: {
    name: "Laboratorios",
    icon: Microscope,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    lightColor: "bg-blue-100",
    priority: "medium",
  },
  treatments: {
    name: "Tratamientos",
    icon: Clipboard,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    lightColor: "bg-orange-100",
    priority: "high",
  },
  procedures: {
    name: "Procedimientos",
    icon: Zap,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    lightColor: "bg-purple-100",
    priority: "medium",
  },
  vitals: {
    name: "Signos Vitales",
    icon: Activity,
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    lightColor: "bg-cyan-100",
    priority: "low",
  },
}

const filterCategories = [
  { id: "all", name: "Todos los registros", icon: FileText, count: 0 },
  ...Object.entries(recordTypes).map(([key, value]) => ({
    id: key,
    name: value.name,
    icon: value.icon,
    count: 0,
  })),
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
}

export default function MedicalRecordsPage() {
  const router = useRouter()
  const isMobile = useMobile()
  const { user, isPatient, isPhysician, isOwner, isReceptionist, clinicId } = useRole()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<MedicalHistoryResponse | null>(null)
  const [clinicData, setClinicData] = useState<ClinicMedicalHistoryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "type" | "priority">("date")

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    if (user) {
      loadMedicalHistory()
    }
  }, [user, currentPage])

  useEffect(() => {
    if (clinicId && (isPhysician() || isOwner() || isReceptionist())) {
      loadMedicalHistory()
    }
  }, [clinicId, currentPage, pageSize])

  const loadMedicalHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isPatient()) {
        if (!user?.id) {
          setError("No se pudo obtener el ID del paciente")
          return
        }
        const response = await medicalHistoryService.getPatientMedicalHistory(user.id)
        if (response.success && response.data) {
          setData(response)
          if (response.data.patients.length === 1) {
            setSelectedPatientId(response.data.patients[0].id)
          }
        } else {
          setError("No se encontró historial médico")
        }
      } else if (isPhysician() || isOwner() || isReceptionist()) {
        if (!clinicId) {
          setError("No se pudo obtener el ID de la clínica")
          return
        }
        const response = await medicalHistoryService.getClinicMedicalHistory(clinicId, currentPage, pageSize)
        if (response.success && response.data) {
          setClinicData(response)
          if (response.data.length > 0) {
            setSelectedPatientId(response.data[0].patient.id)
          }
        } else {
          setError("No se encontró historial médico")
        }
      } else {
        setError("No tienes permisos para acceder a esta información")
        return
      }
    } catch (err: any) {
      console.error("Error loading medical history:", err)

      if (err.response?.status === 404) {
        setError(
          isPatient()
            ? "No tienes historial médico registrado aún. Tu primera consulta médica creará automáticamente tu historial."
            : "No se encontró historial médico para esta clínica",
        )
      } else if (err.response?.status === 403) {
        setError("No tienes permisos para acceder a este historial.")
      } else if (err.response?.status === 500) {
        setError("Error del servidor. Por favor, inténtalo de nuevo en unos minutos.")
      } else {
        setError("Error al cargar el historial médico. Verifica tu conexión e inténtalo de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentPatient = (): PatientMedicalInfo | null => {
    if (isPatient()) {
      return data?.data.patients[0] || null
    }

    if (clinicData?.data) {
      return (
        clinicData.data.find((p) => p.patient.id === selectedPatientId)?.patient || clinicData.data[0]?.patient || null
      )
    }

    return null
  }

  const getCurrentRecords = (): MedicalRecord[] => {
    const currentPatient = getCurrentPatient()
    if (!currentPatient) return []

    let records: MedicalRecord[] = []

    if (isPatient()) {
      records = data?.data.medicalRecords?.filter((record) => record.patientId === currentPatient.id) || []
    } else if (clinicData?.data) {
      const patientHistory = clinicData.data.find((p) => p.patient.id === currentPatient.id)
      records = patientHistory?.medicalRecords || []
    }

    if (selectedCategory !== "all") {
      records = records.filter((record) => record.type === selectedCategory)
    }

    if (searchQuery) {
      records = records.filter(
        (record) =>
          record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.content.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Enhanced sorting
    return records.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.type.localeCompare(b.type)
        case "priority":
          const aPriority = recordTypes[a.type as keyof typeof recordTypes]?.priority || "low"
          const bPriority = recordTypes[b.type as keyof typeof recordTypes]?.priority || "low"
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (
            priorityOrder[bPriority as keyof typeof priorityOrder] -
            priorityOrder[aPriority as keyof typeof priorityOrder]
          )
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })
  }

  const currentPatient = getCurrentPatient()
  const currentRecords = getCurrentRecords()
  const selectedRecordDetails = selectedRecord ? currentRecords.find((r) => r.id === selectedRecord) : null

  // Update filter categories with counts
  const updatedFilterCategories = filterCategories.map((category) => ({
    ...category,
    count:
      category.id === "all"
        ? currentRecords.length
        : currentRecords.filter((record) => record.type === category.id).length,
  }))

  const getRecordTypeConfig = (type: string) => {
    return (
      recordTypes[type as keyof typeof recordTypes] || {
        name: type,
        icon: FileText,
        color: "bg-gradient-to-br from-gray-500 to-gray-600",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
        lightColor: "bg-gray-100",
        priority: "low",
      }
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "cancelled":
        return <X className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const getRecordSummary = (record: MedicalRecord) => {
    if (record.content.description) return record.content.description
    if (record.content.diagnosis) return record.content.diagnosis
    if (record.content.symptoms) return record.content.symptoms
    if (record.content.consult_reason) return record.content.consult_reason
    return "No hay resumen disponible"
  }

  const getPatientStats = () => {
    if (!currentRecords.length) return null

    const activeRecords = currentRecords.filter((r) => r.status === "active").length
    const medications = currentRecords.filter((r) => r.type === "medications").length
    const diagnoses = currentRecords.filter((r) => r.type === "diagnoses").length
    const lastVisit = new Date(Math.max(...currentRecords.map((r) => new Date(r.date).getTime())))
    const recentRecords = currentRecords.filter((r) => {
      const recordDate = new Date(r.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return recordDate >= thirtyDaysAgo
    }).length

    return { activeRecords, medications, diagnoses, lastVisit, recentRecords }
  }

  const stats = getPatientStats()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Cargando Historial Médico</h3>
            <p className="text-sm text-gray-600">Preparando tu información médica...</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {error ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-pink-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No se pudo cargar el historial</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
                <Button
                  onClick={loadMedicalHistory}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    🔄
                  </motion.div>
                  Reintentar
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-8">
              {/* Enhanced Header */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-lg border border-white/20 backdrop-blur-sm p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {isPatient() ? "Mi Historial Médico" : "Registros Médicos"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                          {isPatient()
                            ? "Consulta tu historial médico completo y documentos asociados"
                            : "Consulta y gestiona los registros médicos de los pacientes"}
                        </p>
                      </div>
                    </div>
                    {(data?.data.metadata || clinicData?.summary) && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          Última actualización:{" "}
                          {data?.data.metadata
                            ? new Date(data.data.metadata.lastUpdated).toLocaleDateString()
                            : clinicData?.summary
                              ? new Date(clinicData.summary.lastUpdated).toLocaleDateString()
                              : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <RoleGuard allowedRoles={[UserRole.PHYSICIAN, UserRole.OWNER]}>
                      <Button
                        onClick={() => router.push('/dashboard/new-medical-records')}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 h-12 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Nueva Historia Clínica
                      </Button>
                    </RoleGuard>

                    <RoleGuard allowedRoles={[UserRole.PHYSICIAN, UserRole.OWNER, UserRole.RECEPTIONIST]}>
                      {clinicData && clinicData.data.length > 1 && (
                        <div className="min-w-[320px]">
                          <Select
                            value={selectedPatientId}
                            onValueChange={(value) => {
                              setSelectedPatientId(value)
                              setSelectedRecord(null)
                            }}
                          >
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                              <SelectValue placeholder="Seleccionar Paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              {clinicData.data.map((patientHistory) => (
                                <SelectItem key={patientHistory.patient.id} value={patientHistory.patient.id}>
                                  <div className="flex items-center gap-3 py-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={patientHistory.patient.avatar || "/placeholder.svg"}
                                        alt={patientHistory.patient.name}
                                      />
                                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {patientHistory.patient.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <span className="font-medium">{patientHistory.patient.name}</span>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>({patientHistory.patient.mrn})</span>
                                        <Badge variant="secondary" className="text-xs">
                                          {patientHistory.recordCount} registros
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </RoleGuard>
                  </div>
                </div>

                {/* Enhanced Clinic Summary */}
                <RoleGuard allowedRoles={[UserRole.PHYSICIAN, UserRole.OWNER, UserRole.RECEPTIONIST]}>
                  {clinicData?.summary && (
                    <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-500 rounded-xl">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-600">Total Pacientes</p>
                            <p className="text-2xl font-bold text-blue-900">{clinicData.summary.totalPatients}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-emerald-500 rounded-xl">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-600">Total Registros</p>
                            <p className="text-2xl font-bold text-emerald-900">
                              {clinicData.summary.totalMedicalRecords}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-purple-500 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-600">Actividad Reciente</p>
                            <p className="text-sm font-bold text-purple-900">
                              {new Date(clinicData.summary.recentActivity).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-orange-500 rounded-xl">
                            <Star className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-orange-600">Más Activo</p>
                            <p className="text-sm font-bold text-orange-900 truncate">
                              {clinicData.summary.mostActivePatient}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </RoleGuard>
              </motion.div>

              {/* Enhanced Patient Info */}
              {currentPatient && (
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden shadow-xl border-0 bg-white">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                        <div className="relative z-10 flex items-center gap-6">
                          <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                            <AvatarImage src={currentPatient.avatar || "/placeholder.svg"} alt={currentPatient.name} />
                            <AvatarFallback className="text-xl bg-white/20 text-white font-bold">
                              {currentPatient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2">{currentPatient.name}</h2>
                            <div className="flex flex-wrap items-center gap-6 text-blue-100">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>
                                  {currentPatient.age} años • {currentPatient.gender}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>DOB: {new Date(currentPatient.dob).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>{currentPatient.mrn}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {stats && (
                        <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                                  <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Registros Activos</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.activeRecords}</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                  <Pill className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Medicamentos</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.medications}</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                                  <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Diagnósticos</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.diagnoses}</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                                  <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Última Visita</p>
                                  <p className="text-sm font-bold text-gray-900">
                                    {stats.lastVisit.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
                                  <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Recientes (30d)</p>
                                  <p className="text-2xl font-bold text-gray-900">{stats.recentRecords}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Enhanced Search and Filters */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar por título, proveedor o contenido..."
                      className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full lg:w-56 h-14 border-2 border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {updatedFilterCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <div className="flex items-center gap-2">
                                <category.icon className="h-4 w-4" />
                                <span>{category.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {category.count}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: "date" | "type" | "priority") => setSortBy(value)}>
                      <SelectTrigger className="w-full lg:w-48 h-14 border-2 border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Fecha</SelectItem>
                        <SelectItem value="type">Tipo</SelectItem>
                        <SelectItem value="priority">Prioridad</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="h-14 px-4 rounded-none"
                      >
                        <div className="grid grid-cols-2 gap-1 w-4 h-4">
                          <div className="bg-current rounded-sm"></div>
                          <div className="bg-current rounded-sm"></div>
                          <div className="bg-current rounded-sm"></div>
                          <div className="bg-current rounded-sm"></div>
                        </div>
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="h-14 px-4 rounded-none"
                      >
                        <div className="space-y-1 w-4 h-4">
                          <div className="bg-current h-1 rounded-sm"></div>
                          <div className="bg-current h-1 rounded-sm"></div>
                          <div className="bg-current h-1 rounded-sm"></div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Records Display */}
              <motion.div variants={itemVariants}>
                {currentRecords.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                    }
                  >
                    <AnimatePresence>
                      {currentRecords.map((record, index) => {
                        const typeConfig = getRecordTypeConfig(record.type)
                        const Icon = typeConfig.icon
                        const isSelected = selectedRecord === record.id

                        return (
                          <motion.div
                            key={record.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            transition={{ delay: index * 0.05 }}
                            layout
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-xl ${
                                isSelected
                                  ? "ring-4 ring-blue-500/20 border-blue-500 shadow-xl"
                                  : "border-gray-200 hover:border-blue-300"
                              } ${viewMode === "list" ? "flex items-center" : ""}`}
                              onClick={() => setSelectedRecord(record.id)}
                            >
                              {viewMode === "grid" ? (
                                <>
                                  <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${typeConfig.color} shadow-lg`}>
                                          <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <CardTitle className="text-lg leading-tight mb-2">{record.title}</CardTitle>
                                          <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                              <Calendar className="h-3 w-3" />
                                              {new Date(record.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <MapPin className="h-3 w-3" />
                                              {record.provider}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <Badge className={`${getStatusColor(record.status)} flex items-center gap-1`}>
                                        {getStatusIcon(record.status)}
                                        {record.status}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                                      {getRecordSummary(record)}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <Badge
                                        variant="outline"
                                        className={`${typeConfig.textColor} ${typeConfig.borderColor} font-medium`}
                                      >
                                        {typeConfig.name}
                                      </Badge>
                                      <div className="flex items-center gap-2">
                                        {typeConfig.priority === "high" && (
                                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        )}
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </>
                              ) : (
                                <CardContent className="p-6 flex items-center gap-6 w-full">
                                  <div className={`p-3 rounded-2xl ${typeConfig.color} shadow-lg flex-shrink-0`}>
                                    <Icon className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-lg font-semibold truncate">{record.title}</h3>
                                      <Badge
                                        className={`${getStatusColor(record.status)} flex items-center gap-1 ml-4`}
                                      >
                                        {getStatusIcon(record.status)}
                                        {record.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(record.date).toLocaleDateString()}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {record.provider}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`${typeConfig.textColor} ${typeConfig.borderColor}`}
                                      >
                                        {typeConfig.name}
                                      </Badge>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-2">{getRecordSummary(record)}</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {typeConfig.priority === "high" && (
                                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    )}
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div variants={itemVariants} className="text-center py-16">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6"
                    >
                      <FileSearch className="h-12 w-12 text-blue-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron registros</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                      {searchQuery || selectedCategory !== "all"
                        ? "Intenta ajustar tus filtros de búsqueda para encontrar los registros que buscas"
                        : isPatient()
                          ? "Aún no tienes registros médicos. Se crearán automáticamente después de tus consultas médicas."
                          : "Este paciente aún no tiene registros médicos en el sistema"}
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Limpiar Filtros
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {/* Enhanced Pagination */}
              <RoleGuard allowedRoles={[UserRole.PHYSICIAN, UserRole.OWNER, UserRole.RECEPTIONIST]}>
                {clinicData?.pagination && clinicData.pagination.totalPages > 1 && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>
                          Página {clinicData.pagination.currentPage} de {clinicData.pagination.totalPages}(
                          {clinicData.pagination.totalRecords} registros totales)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!clinicData.pagination.hasPrevious}
                          className="h-10 px-4 rounded-xl border-2"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Anterior
                        </Button>

                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, clinicData.pagination.totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, currentPage - 2) + i
                            if (pageNum > clinicData.pagination.totalPages) return null

                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10 h-10 rounded-xl border-2"
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!clinicData.pagination.hasNext}
                          className="h-10 px-4 rounded-xl border-2"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </RoleGuard>

              {/* Enhanced Record Details Modal */}
              {selectedRecord && selectedRecordDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                  onClick={() => setSelectedRecord(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Enhanced Modal Header */}
                    <div className="p-8 border-b bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-4 rounded-2xl ${getRecordTypeConfig(selectedRecordDetails.type).color} shadow-lg`}
                          >
                            {(() => {
                              const Icon = getRecordTypeConfig(selectedRecordDetails.type).icon
                              return <Icon className="h-8 w-8 text-white" />
                            })()}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{selectedRecordDetails.title}</h3>
                            <div className="flex items-center gap-4 text-blue-100">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(selectedRecordDetails.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {selectedRecordDetails.provider}
                              </div>
                              <Badge
                                className={`${getStatusColor(selectedRecordDetails.status)} flex items-center gap-1`}
                              >
                                {getStatusIcon(selectedRecordDetails.status)}
                                {selectedRecordDetails.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRecord(null)}
                          className="text-white hover:bg-white/20 rounded-xl h-12 w-12"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Modal Content */}
                    <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
                      <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                          <TabsTrigger value="details" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Detalles
                          </TabsTrigger>
                          <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Cronología
                          </TabsTrigger>
                          <TabsTrigger value="actions" className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Acciones
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                          {/* Enhanced content sections with better visual hierarchy */}
                          {selectedRecordDetails.content.description && (
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Descripción General
                              </h4>
                              <p className="text-gray-700 leading-relaxed">
                                {selectedRecordDetails.content.description}
                              </p>
                            </div>
                          )}

                          {selectedRecordDetails.content.consult_reason && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                                <Info className="h-5 w-5" />
                                Motivo de Consulta
                              </h4>
                              <p className="text-blue-800 leading-relaxed">
                                {selectedRecordDetails.content.consult_reason}
                              </p>
                            </div>
                          )}

                          {selectedRecordDetails.content.diagnosis && (
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-lg">
                                <Stethoscope className="h-5 w-5" />
                                Diagnóstico
                              </h4>
                              <p className="text-red-800 leading-relaxed">{selectedRecordDetails.content.diagnosis}</p>
                            </div>
                          )}

                          {selectedRecordDetails.content.symptoms && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-lg">
                                <AlertCircle className="h-5 w-5" />
                                Síntomas
                              </h4>
                              <p className="text-amber-800 leading-relaxed">{selectedRecordDetails.content.symptoms}</p>
                            </div>
                          )}

                          {selectedRecordDetails.content.treatment && (
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                              <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2 text-lg">
                                <Clipboard className="h-5 w-5" />
                                Plan de Tratamiento
                              </h4>
                              <p className="text-emerald-800 leading-relaxed">
                                {selectedRecordDetails.content.treatment}
                              </p>
                            </div>
                          )}

                          {selectedRecordDetails.content.medications &&
                            selectedRecordDetails.content.medications.length > 0 && (
                              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                                <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2 text-lg">
                                  <Pill className="h-5 w-5" />
                                  Medicamentos Prescritos ({selectedRecordDetails.content.medications.length})
                                </h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                  {selectedRecordDetails.content.medications.map((med, index) => (
                                    <div
                                      key={index}
                                      className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm"
                                    >
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-emerald-500 rounded-lg">
                                          <Pill className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <span className="font-bold text-emerald-900 text-lg">{med.name}</span>
                                          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 ml-2">
                                            {med.dosage}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-sm text-emerald-700">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="font-medium">Frecuencia:</span>
                                            <p>{med.frequency}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium">Duración:</span>
                                            <p>{med.duration}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Prescrito por:</span>
                                          <p>{med.prescriber}</p>
                                        </div>
                                        {med.instructions && (
                                          <div>
                                            <span className="font-medium">Instrucciones:</span>
                                            <p className="italic">{med.instructions}</p>
                                          </div>
                                        )}
                                        <div>
                                          <span className="font-medium">Fecha de inicio:</span>
                                          <p>{new Date(med.startDate).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {selectedRecordDetails.content.allergies && (
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-lg">
                                <AlertTriangle className="h-5 w-5" />
                                Alergias Conocidas
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <p className="text-red-800 font-medium">{selectedRecordDetails.content.allergies}</p>
                              </div>
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-6">
                            {selectedRecordDetails.content.family_info && (
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
                                <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                                  <Users className="h-5 w-5" />
                                  Antecedentes Familiares
                                </h4>
                                <p className="text-purple-800 leading-relaxed">
                                  {selectedRecordDetails.content.family_info}
                                </p>
                              </div>
                            )}

                            {selectedRecordDetails.content.personal_info && (
                              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Información Personal
                                </h4>
                                <p className="text-blue-800 leading-relaxed">
                                  {selectedRecordDetails.content.personal_info}
                                </p>
                              </div>
                            )}
                          </div>

                          {(selectedRecordDetails.content.observations || selectedRecordDetails.content.notes) && (
                            <div className="grid md:grid-cols-2 gap-6">
                              {selectedRecordDetails.content.observations && (
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200">
                                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Observaciones Clínicas
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed">
                                    {selectedRecordDetails.content.observations}
                                  </p>
                                </div>
                              )}

                              {selectedRecordDetails.content.notes && (
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200">
                                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Bookmark className="h-5 w-5" />
                                    Notas Adicionales
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed">{selectedRecordDetails.content.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="timeline" className="space-y-6">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
                              <Clock className="h-5 w-5" />
                              Cronología del Registro
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-200">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-blue-900">Registro Creado</p>
                                  <p className="text-sm text-blue-700">
                                    {new Date(selectedRecordDetails.date).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-green-200">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-green-900">Estado Actual</p>
                                  <p className="text-sm text-green-700 capitalize">{selectedRecordDetails.status}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="actions" className="space-y-6">
                          <div className="grid md:grid-cols-1 gap-6">
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                              <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Exportar Registro
                              </h4>
                              <div className="space-y-3">
                                <Button className="w-full justify-start gap-2" variant="outline">
                                  <Download className="h-4 w-4" />
                                  Descargar PDF
                                </Button>
                                <Button className="w-full justify-start gap-2" variant="outline">
                                  <Printer className="h-4 w-4" />
                                  Imprimir Registro
                                </Button>
                              </div>
                            </div>

                            
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Enhanced Modal Footer */}
                    <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700 font-medium">Altheia EHR</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          <span className="text-purple-700 font-medium">Verificado</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
