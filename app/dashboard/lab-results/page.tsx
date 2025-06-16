"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Menu,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  User,
  FlaskConical,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useAuth } from "@/context/AuthContext";
import { RoleGuard } from "@/guard/RoleGuard";
import { UserRole } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos de ejemplo para resultados de laboratorio
const mockLabResults = [
  {
    id: "LAB001",
    patientName: "María García",
    patientId: "PAT001",
    testType: "Hemograma Completo",
    status: "completed",
    requestDate: "2024-01-15",
    completedDate: "2024-01-16",
    technician: "Dr. Rodriguez",
    urgency: "normal",
    results: {
      hemoglobin: "14.2 g/dL",
      hematocrit: "42%",
      leukocytes: "7,500/μL",
    },
  },
  {
    id: "LAB002",
    patientName: "Carlos López",
    patientId: "PAT002",
    testType: "Glucosa en Ayunas",
    status: "pending",
    requestDate: "2024-01-16",
    completedDate: null,
    technician: "Dra. Martínez",
    urgency: "urgent",
    results: null,
  },
  {
    id: "LAB003",
    patientName: "Ana Ruiz",
    patientId: "PAT003",
    testType: "Perfil Lipídico",
    status: "completed",
    requestDate: "2024-01-14",
    completedDate: "2024-01-15",
    technician: "Dr. Rodriguez",
    urgency: "normal",
    results: {
      colesterol: "180 mg/dL",
      trigliceridos: "120 mg/dL",
      hdl: "50 mg/dL",
    },
  },
];

export default function LabResultsPage() {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const filteredResults = mockLabResults.filter((result) => {
    const matchesSearch =
      result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || result.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <ClipboardCheck className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Activity className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <FlaskConical className="h-3 w-3 mr-1" />
            Procesando
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Urgente
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200">
            Normal
          </Badge>
        );
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

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

  return (
    <RoleGuard allowedRoles={[UserRole.RECEPTIONIST, UserRole.LAB_TECHNICIAN, UserRole.PHYSICIAN]}>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white dark:bg-slate-800 dark:border-slate-700 px-4 md:px-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden dark:text-white dark:hover:bg-slate-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-semibold dark:text-white">
                  Resultados de Laboratorio
                </h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="space-y-6"
              >
                {/* Page Header */}
                <motion.div variants={item}>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Resultados de Laboratorio
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Gestiona y revisa los resultados de análisis clínicos
                  </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={item}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <FlaskConical className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                              {mockLabResults.length}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Total Análisis
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <ClipboardCheck className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                              {
                                mockLabResults.filter((r) => r.status === "completed")
                                  .length
                              }
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Completados
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Activity className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                              {
                                mockLabResults.filter((r) => r.status === "pending")
                                  .length
                              }
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Pendientes
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                              {
                                mockLabResults.filter((r) => r.urgency === "urgent")
                                  .length
                              }
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Urgentes
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* Filters */}
                <motion.div variants={item}>
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Buscar por paciente, tipo de análisis o ID..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="completed">Completados</SelectItem>
                            <SelectItem value="pending">Pendientes</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Urgencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las urgencias</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Results List */}
                <motion.div variants={item}>
                  <div className="space-y-4">
                    {filteredResults.map((result) => (
                      <Card
                        key={result.id}
                        className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0 hover:shadow-xl transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FlaskConical className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                                  {result.testType}
                                </h3>
                                {getStatusBadge(result.status)}
                                {getUrgencyBadge(result.urgency)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Paciente: {result.patientName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Solicitado: {result.requestDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>ID: {result.id}</span>
                                </div>
                                {result.completedDate && (
                                  <div className="flex items-center gap-2">
                                    <span>Completado: {result.completedDate}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </Button>
                              {result.status === "completed" && (
                                <Button size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Descargar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredResults.length === 0 && (
                      <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                        <CardContent className="p-12 text-center">
                          <FlaskConical className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            No se encontraron resultados
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            No hay resultados de laboratorio que coincidan con los filtros aplicados.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
} 