"use client"

import { useState, useEffect } from "react";
import { ClinicalHistoryViewerPatient } from "@/components/Dashboard/Patient/clinical-history-viewer-patient";
import { RoleGuard } from "@/guard/RoleGuard";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, User, Activity, Search, Filter, Users, Calendar } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import apiClient from "@/fetch/apiClient";
import { getClinicInformationByUser, getPatientsInClinic } from "@/services/clinic.service";

// Vista para Pacientes - ver su propio historial
function PatientHistoryView() {
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    apiClient.get(`/auth/user/${user?.id}`)
    .then((res) => {
      setPatientId(res.data.role_details.patient_id);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [user]);

  const handleOpenHistory = () => {
    setOpen(true);
  };

  const handleCloseHistory = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="mb-6 gap-2 hover:bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </Button>
            
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl mb-6">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 tracking-tight">
                Mi Historial Clínico
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Accede a tu información médica completa, consultas anteriores y prescripciones 
                en un formato profesional y seguro
              </p>
            </div>
          </div>

          {/* Welcome Card */}
          <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-sm overflow-hidden relative">
            <CardHeader className="pb-6 relative z-10">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold">
                    Bienvenido, {user?.name}
                  </span>
                  <p className="text-sm text-slate-500 font-normal mt-1">
                    Tu información médica está segura y siempre disponible
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                    Desde aquí puedes acceder a tu historial médico completo, 
                    revisar consultas anteriores, prescripciones y descargar 
                    documentos en formato PDF profesional.
                  </p>
                  <Button 
                    onClick={handleOpenHistory}
                    className="gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <FileText className="h-6 w-6" />
                    Ver Mi Historial Clínico
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Clinical History Modal */}
      <ClinicalHistoryViewerPatient 
        patientId={patientId || undefined}
        open={open} 
        onOpenChange={handleCloseHistory} 
      />
    </div>
  );
}

// Vista para Recepcionistas - ver historiales de todos los pacientes
function ReceptionistHistoryView() {
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return;
      try {
        const clinicRes = await getClinicInformationByUser(user);
        const clinicId = clinicRes.data?.clinic?.id || clinicRes.data?.information?.clinic_id;
        if (!clinicId) throw new Error("No clinic id found");
        
        const res = await getPatientsInClinic(clinicId);
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  const filteredPatients = patients.filter((patient) =>
    patient.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewHistory = (patientId: string) => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleCloseHistory = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedPatientId(null);
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={item}>
              <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="mb-4 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Historiales Clínicos
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Accede a los historiales médicos de todos los pacientes
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={item}>
              <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Buscar por nombre, email o ID del paciente..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{filteredPatients.length} pacientes encontrados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Patients List */}
            <motion.div variants={item}>
              <div className="grid gap-4">
                {filteredPatients.map((patient) => {
                  const dob = patient.date_of_birth ? new Date(patient.date_of_birth) : null;
                  const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 'N/A';
                  
                  return (
                    <Card
                      key={patient.id}
                      className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0 hover:shadow-xl transition-all duration-200 cursor-pointer"
                      onClick={() => handleViewHistory(patient.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                                {patient.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                                  {patient.user?.name || 'Sin nombre'}
                                </h3>
                                <Badge variant={patient.user?.status ? "default" : "secondary"}>
                                  {patient.user?.status ? "Activo" : "Inactivo"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>ID: {patient.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Edad: {age} años</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>📧 {patient.user?.email || 'Sin email'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Historial
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredPatients.length === 0 && (
                  <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg border-0">
                    <CardContent className="p-12 text-center">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No se encontraron pacientes
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        No hay pacientes que coincidan con la búsqueda.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Clinical History Modal */}
      <ClinicalHistoryViewerPatient 
        patientId={selectedPatientId || undefined}
        open={open} 
        onOpenChange={handleCloseHistory} 
      />
    </div>
  );
}

export default function PatientHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const isMobile = useMobile();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <RoleGuard allowedRoles={[UserRole.PATIENT, UserRole.RECEPTIONIST]}>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        {/* Renderizar vista según el rol */}
        {user?.role === 'patient' ? <PatientHistoryView /> : <ReceptionistHistoryView />}
      </div>
    </RoleGuard>
  );
}