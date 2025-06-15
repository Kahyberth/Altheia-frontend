"use client"

import { useState, useEffect } from "react";
import { ClinicalHistoryViewerPatient } from "@/components/Dashboard/Patient/clinical-history-viewer-patient";
import { PatientOnly } from "@/guard/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, User, Activity } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import apiClient from "@/fetch/apiClient";

export default function PatientHistoryPage() {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useMobile();

  useEffect(() => {
    apiClient.get(`/auth/user/${user?.id}`)
    .then((res) => {
      setPatientId(res.data.role_details.patient_id);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [user]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleOpenHistory = () => {
    setOpen(true);
  };

  const handleCloseHistory = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {}
  };

  return (
    <PatientOnly>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
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
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] bg-[length:24px_24px]"></div>
            </div>
            
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
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-xl opacity-20"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-600">Sistema Activo</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full w-4/5"></div>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full w-3/5"></div>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="pt-8 pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-fit mx-auto shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-800">Consultas Detalladas</h3>
                <p className="text-slate-600 leading-relaxed">
                  Revisa todas tus consultas médicas con información completa, 
                  diagnósticos y tratamientos prescritos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="pt-8 pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-green-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl w-fit mx-auto shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-800">Prescripciones</h3>
                <p className="text-slate-600 leading-relaxed">
                  Accede a todas tus medicaciones, dosis, frecuencias 
                  e instrucciones específicas de cada tratamiento
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="pt-8 pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl w-fit mx-auto shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-800">Descarga PDF</h3>
                <p className="text-slate-600 leading-relaxed">
                  Genera y descarga tu historial completo en formato 
                  PDF profesional para compartir con otros médicos
                </p>
              </CardContent>
            </Card>
            </div>
            </div>
          </main>
        </div>

        {/* Clinical History Modal */}
        <ClinicalHistoryViewerPatient 
          patientId={patientId || undefined}
          open={open} 
          onOpenChange={handleCloseHistory} 
        />
      </div>
    </PatientOnly>
  );
}