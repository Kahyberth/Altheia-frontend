"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, MapPin, Phone, Mail, Globe, Users, Plus, Edit, X, Shield, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AddEpsDialog } from "@/components/add-eps-dialog"
import { AddServiceDialog } from "@/components/add-service-dialog"
import { EditClinicInfoDialog } from "@/components/edit-clinic-info-dialog"
import { ClinicInformation, Services, EPS, EpsOffered, ClinicEditForm } from "@/types/clinic"
import { getAllServices, getAllEps, getClinicInformation, addClinicEps, removeClinicEps, removeClinicService, updateClinicInformation, assignClinicServices } from "@/services/clinic.service"
import { useAuth } from "@/context/AuthContext"

export default function ClinicManagementPage() {
  const isMobile = useMobile()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [addEpsOpen, setAddEpsOpen] = useState(false)
  const [addServiceOpen, setAddServiceOpen] = useState(false)
  const [editInfoOpen, setEditInfoOpen] = useState(false)

  // Pagination states
  const [servicesPage, setServicesPage] = useState(1)
  const [epsPage, setEpsPage] = useState(1)
  const [hasMoreServices, setHasMoreServices] = useState(true)
  const [hasMoreEps, setHasMoreEps] = useState(true)

  // Data states
  const [clinicInfo, setClinicInfo] = useState<ClinicInformation | null>(null)
  const [availableServices, setAvailableServices] = useState<Services[]>([])
  const [availableEps, setAvailableEps] = useState<EPS[]>([])

  // Loading states
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingEps, setLoadingEps] = useState(false)

  useEffect(() => {
    const fetchClinicData = async () => {
      if (!user?.id) return
      try {
        const response = await getClinicInformation(user.id)
        setClinicInfo(response.data)
      } catch (error) {
        console.error('Error fetching clinic information:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClinicData()
  }, [user?.id])

  const loadMoreServices = async () => {
    if (loadingServices || !hasMoreServices) return
    setLoadingServices(true)
    try {
      const response = await getAllServices(servicesPage, 10)
      const newServices = Array.isArray(response.data) ? response.data : (response.data as any).data ?? []
      if (newServices.length < 10) {
        setHasMoreServices(false)
      }
      setAvailableServices(prev => [...prev, ...newServices])
      setServicesPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoadingServices(false)
    }
  }

  const loadMoreEps = async () => {
    if (loadingEps || !hasMoreEps) return
    setLoadingEps(true)
    try {
      const response = await getAllEps(epsPage, 10)
      const newEps = Array.isArray(response.data) ? response.data : (response.data as any).data ?? []
      if (newEps.length < 10) {
        setHasMoreEps(false)
      }
      setAvailableEps(prev => [...prev, ...newEps])
      setEpsPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading EPS:', error)
    } finally {
      setLoadingEps(false)
    }
  }

  useEffect(() => {
    loadMoreServices()
    loadMoreEps()
  }, []) // Initial load

  const handleAddEps = async (newEps: string[]) => {
    if (!user?.id) return
    try {
      await Promise.all(newEps.map(epsId => addClinicEps(user.id, epsId)))
      const response = await getClinicInformation(user.id)
      setClinicInfo(response.data)
    } catch (error) {
      console.error('Error adding EPS:', error)
    }
  }

  const handleRemoveEps = async (epsId: string) => {
    if (!user?.id) return
    try {
      await removeClinicEps(user.id, epsId)
      const response = await getClinicInformation(user.id)
      setClinicInfo(response.data)
    } catch (error) {
      console.error('Error removing EPS:', error)
    }
  }

  const handleAddService = async (newServices: string[]) => {
    if (!clinicInfo) return
    try {
      await assignClinicServices(clinicInfo.information.clinic_id, newServices)
      const response = await getClinicInformation(clinicInfo.owner.id)
      setClinicInfo(response.data)
    } catch (error) {
      console.error('Error adding services:', error)
    }
  }

  const handleRemoveService = async (serviceId: string) => {
    if (!user?.id) return
    try {
      await removeClinicService(user.id, serviceId)
      const response = await getClinicInformation(user.id)
      setClinicInfo(response.data)
    } catch (error) {
      console.error('Error removing service:', error)
    }
  }

  const handleUpdateClinicInfo = async (updatedInfo: Partial<ClinicEditForm>) => {
    if (!user?.id) return
    try {
      await updateClinicInformation(user.id, updatedInfo)
      const response = await getClinicInformation(user.id)
      setClinicInfo(response.data)
    } catch (error) {
      console.error('Error updating clinic info:', error)
    }
  }

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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
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
            <Building2 className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Cargando gestión de clínica...</p>
        </motion.div>
      </div>
    )
  }

  if (!clinicInfo) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No se encontró información de la clínica</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Por favor, contacta al administrador del sistema.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white dark:bg-slate-800 dark:border-slate-700 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden dark:text-white dark:hover:bg-slate-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-semibold dark:text-white">Gestión de Clínica</h1>
            </div>
          </div>
          <Button onClick={() => setEditInfoOpen(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Editar Información
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-6xl space-y-6">
            {/* Clinic Overview */}
            <motion.div variants={item}>
              <Card className="overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{clinicInfo.information.clinic_name}</h2>
                      <p className="mt-1 text-cyan-100">{clinicInfo.information.clinic_description}</p>
                    </div>
                    <div className="rounded-full bg-white/20 p-3">
                      <Building2 className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-200" />
                      <div>
                        <p className="text-sm text-cyan-200">Personal</p>
                        <p className="font-semibold">{clinicInfo.information.employee_count} miembros</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-cyan-200" />
                      <div>
                        <p className="text-sm text-cyan-200">Servicios</p>
                        <p className="font-semibold">{(clinicInfo.information["services offered"] ?? []).length} servicios</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-cyan-200" />
                      <div>
                        <p className="text-sm text-cyan-200">EPS Aceptadas</p>
                        <p className="font-semibold">{clinicInfo.information["eps offered"].length} EPS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div variants={item}>
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 dark:bg-slate-800">
                  <TabsTrigger value="general" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">Información General</TabsTrigger>
                  <TabsTrigger value="owner" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">Propietario</TabsTrigger>
                  <TabsTrigger value="services" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">Servicios</TabsTrigger>
                  <TabsTrigger value="eps" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">EPS Aceptadas</TabsTrigger>
                </TabsList>

                {/* General Information */}
                <TabsContent value="general" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          Información de la Clínica
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Nombre</Label>
                          <p className="text-sm dark:text-slate-300">{clinicInfo.information.clinic_name}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <p className="text-sm dark:text-slate-300">{clinicInfo.information.clinic_email}</p>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Teléfono</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <p className="text-sm dark:text-slate-300">{clinicInfo.information.clinic_phone}</p>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Sitio Web</Label>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <a href={clinicInfo.information.clinic_website} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                              {clinicInfo.information.clinic_website}
                            </a>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Descripción</Label>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{clinicInfo.information.clinic_description}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Ubicación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-2">
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Dirección</Label>
                          <p className="text-sm dark:text-slate-300">{clinicInfo.information.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Ciudad</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.information.city}</p>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Estado</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.information.state}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">País</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.information.country}</p>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Código Postal</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.information.postal_code}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Owner Information */}
                <TabsContent value="owner" className="space-y-6">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-white">
                        <Users className="h-5 w-5 text-blue-600" />
                        Información del Propietario
                      </CardTitle>
                      <CardDescription className="dark:text-slate-400">Datos del responsable legal y director de la clínica</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Nombre Completo</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.owner.name}</p>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</Label>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                              <p className="text-sm dark:text-slate-300">{clinicInfo.owner.email}</p>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Teléfono</Label>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                              <p className="text-sm dark:text-slate-300">{clinicInfo.owner.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Número de Documento</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.owner.document_number}</p>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Género</Label>
                            <p className="text-sm dark:text-slate-300">{clinicInfo.owner.gender}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Services */}
                <TabsContent value="services" className="space-y-6">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                            Servicios Ofrecidos
                          </CardTitle>
                          <CardDescription className="dark:text-slate-400">Gestiona los servicios médicos que ofrece tu clínica</CardDescription>
                        </div>
                        <Button onClick={() => setAddServiceOpen(true)} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Añadir Servicio
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {(clinicInfo.information["services offered"] ?? []).map((service: Services, index: number) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center justify-between rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 p-3 hover:shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-blue-50 dark:bg-blue-900 p-1.5">
                                <Stethoscope className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium dark:text-white">{service.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-slate-600"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      {(clinicInfo.information["services offered"] ?? []).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Stethoscope className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                          <p className="text-slate-500 dark:text-slate-400">No hay servicios registrados</p>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Añade servicios para comenzar</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* EPS */}
                <TabsContent value="eps" className="space-y-6">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Shield className="h-5 w-5 text-blue-600" />
                            EPS Aceptadas
                          </CardTitle>
                          <CardDescription className="dark:text-slate-400">
                            Administra las EPS que acepta tu clínica para atención médica
                          </CardDescription>
                        </div>
                        <Button onClick={() => setAddEpsOpen(true)} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Añadir EPS
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {clinicInfo.information["eps offered"].map((eps: EpsOffered, index: number) => (
                          <motion.div
                            key={eps.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center justify-between rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 p-3 hover:shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-green-50 dark:bg-green-900 p-1.5">
                                <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm font-medium dark:text-white">{eps.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-slate-600"
                              onClick={() => handleRemoveEps(eps.id)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      {clinicInfo.information["eps offered"].length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                          <p className="text-slate-500 dark:text-slate-400">No hay EPS registradas</p>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Añade EPS para comenzar</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Dialogs */}
      <AddEpsDialog
        open={addEpsOpen}
        onOpenChange={setAddEpsOpen}
        onAddEps={handleAddEps}
        existingEps={clinicInfo.information["eps offered"].map((eps: EpsOffered) => eps.name)}
      />
      <AddServiceDialog
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        onAddServices={handleAddService}
        existingServices={(clinicInfo.information["services offered"] ?? []).map((service: Services) => service.name)}
      />
      <EditClinicInfoDialog
        open={editInfoOpen}
        onOpenChange={setEditInfoOpen}
        clinicInfo={{
          clinic_name: clinicInfo.information.clinic_name,
          clinic_email: clinicInfo.information.clinic_email,
          clinic_phone: clinicInfo.information.clinic_phone,
          clinic_description: clinicInfo.information.clinic_description,
          clinic_website: clinicInfo.information.clinic_website,
          employee_count: clinicInfo.information.employee_count,
          address: clinicInfo.information.address,
          city: clinicInfo.information.city,
          state: clinicInfo.information.state,
          postal_code: clinicInfo.information.postal_code,
          country: clinicInfo.information.country,
          clinic_id: clinicInfo.information.clinic_id,
          "services offered": clinicInfo.information["services offered"],
          "eps offered": clinicInfo.information["eps offered"]
        }}
        onUpdateInfo={handleUpdateClinicInfo}
      />
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
