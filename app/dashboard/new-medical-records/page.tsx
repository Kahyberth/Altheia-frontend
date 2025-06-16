"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Pill, Heart, AlertTriangle, Plus, Trash2, Shield, Stethoscope, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { RoleGuard } from "@/guard/RoleGuard"
import { useMobile } from "@/hooks/use-mobile"
import { useRole } from "@/hooks/useRole"
import { UserRole } from "@/types/auth"
import { getPatientsInClinic, getPersonnelInClinic } from "@/services/clinic.service"
import { addMedicalHistory } from "@/services/medical.service"
import { PatientByClinic, PersonalInClinic } from "@/types/clinic"
import { MedicalConsultation } from "@/types/medical"
import { addToast } from "@heroui/react"
import apiClient from "@/fetch/apiClient"

// Use a simplified prescription interface for the form
interface FormPrescription {
  medicine: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface MedicalRecord {
  patient_id: string
  physician_id: string
  symptoms: string
  diagnosis: string
  treatment: string
  notes: string
  prescriptions: FormPrescription[]
  update_medical_history: boolean
  allergies: string
  consult_reason: string
  personal_info: string
  family_info: string
  observations: string
}

export default function NewMedicalRecordPage() {
  const router = useRouter()
  const isMobile = useMobile()
  const { user, isPhysician, isOwner } = useRole()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [patients, setPatients] = useState<PatientByClinic[]>([])
  const [physicians, setPhysicians] = useState<PersonalInClinic[]>([])

  const [formData, setFormData] = useState<MedicalRecord>({
    patient_id: "",
    physician_id: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    prescriptions: [],
    update_medical_history: true,
    allergies: "",
    consult_reason: "",
    personal_info: "",
    family_info: "",
    observations: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadData = async () => {
      if (!user?.clinic_id) {
        setIsLoading(false)
        return
      }

      try {
       
        const patientsResponse = await getPatientsInClinic(user.clinic_id)
        console.log('Patients data:', patientsResponse.data)
        setPatients(patientsResponse.data || [])


        if (isPhysician()) {

          const physicianInfo = await apiClient.get(`/auth/user/${user.id}`)

          const physicianId = physicianInfo.data.role_details.physician_id

          setFormData(prev => ({ ...prev, physician_id: physicianId }))
        } else if (isOwner()) {
         
          const personnelResponse = await getPersonnelInClinic(user.clinic_id)
          const medicalPersonnel = (personnelResponse.data || []).filter(
            person => person.rol === 'physician'
          )
          setPhysicians(medicalPersonnel)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        addToast({
          title: "Error",
          description: "Error al cargar los datos"
        })
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      loadData()
    }, 800)

    return () => clearTimeout(timer)
  }, [user, isPhysician, isOwner])

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const addPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions,
        {
          medicine: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }))
  }

  const removePrescription = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }))
  }

  const updatePrescription = (index: number, field: keyof FormPrescription, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((prescription, i) =>
        i === index ? { ...prescription, [field]: value } : prescription,
      ),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patient_id) newErrors.patient_id = "Seleccione un paciente"
    if (!formData.physician_id) newErrors.physician_id = "Seleccione un médico"
    if (!formData.symptoms.trim()) newErrors.symptoms = "Ingrese los síntomas"
    if (!formData.diagnosis.trim()) newErrors.diagnosis = "Ingrese el diagnóstico"
    if (!formData.treatment.trim()) newErrors.treatment = "Ingrese el tratamiento"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)

    try {
      const medicalConsultation: MedicalConsultation = {
        patient_id: formData.patient_id,
        physician_id: formData.physician_id,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
        prescriptions: formData.prescriptions as any,
        update_medical_history: formData.update_medical_history,
        consult_reason: formData.consult_reason,
        personal_info: formData.personal_info,
        family_info: formData.family_info,
        allergies: formData.allergies,
        observations: formData.observations,
      }

      await addMedicalHistory(medicalConsultation)
      
      addToast({
        title: "Historia clínica creada exitosamente",
        description: "La historia clínica se ha guardado correctamente"
      })
      router.push("/dashboard/medical-records")
    } catch (error) {
      console.error('Error saving medical record:', error)
      addToast({
        title: "Error",
        description: "Error al guardar la historia clínica"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectedPatient = patients.find((p) => p.id === formData.patient_id)
  const selectedPhysician = physicians.find((p) => p.id === formData.physician_id) || 
    (isPhysician() && user ? user : null)

  if (isLoading) {
    return (
      <RoleGuard 
        allowedRoles={[UserRole.PHYSICIAN, UserRole.OWNER]}
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h1 className="text-xl font-semibold mb-2">Acceso Denegado</h1>
              <p className="text-muted-foreground">Solo los médicos y administradores pueden crear historias clínicas.</p>
            </div>
          </div>
        }
      >
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
              />
              <p className="text-sm text-muted-foreground">Cargando formulario...</p>
            </div>
          </div>
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard 
      allowedRoles={[UserRole.PHYSICIAN, UserRole.OWNER]}
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-xl font-semibold mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground">Solo los médicos y administradores pueden crear historias clínicas.</p>
          </div>
        </div>
      }
    >
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon" onClick={() => router.back()} className="h-9 w-9">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nueva Historia Clínica</h1>
                    <p className="text-muted-foreground">Crear un registro médico completo y detallado</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Altheia EHR</span>
                  </Badge>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Historia
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Form Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Tabs defaultValue="general" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger value="clinical" className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4" />
                      <span className="hidden sm:inline">Clínica</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Historia</span>
                    </TabsTrigger>
                    <TabsTrigger value="allergies" className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="hidden sm:inline">Alergias</span>
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
                      <Pill className="h-4 w-4" />
                      <span className="hidden sm:inline">Recetas</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Información General</span>
                        </CardTitle>
                        <CardDescription>Seleccione el paciente{isOwner() ? ' y médico tratante' : ''} para esta consulta</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className={`grid grid-cols-1 ${isOwner() ? 'md:grid-cols-2' : ''} gap-6`}>
                          {/* Patient Selection */}
                          <div className="space-y-2">
                            <Label htmlFor="patient">Paciente *</Label>
                            <Select
                              value={formData.patient_id}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, patient_id: value }))}
                            >
                              <SelectTrigger className={errors.patient_id ? "border-destructive" : ""}>
                                <SelectValue placeholder="Seleccionar paciente" />
                              </SelectTrigger>
                              <SelectContent>
                                {patients.map((patient) => {
                                  const patientName = patient.user?.name || patient.name || 'Sin nombre'
                                  const patientGender = patient.user?.gender || 'No especificado'
                                  const patientEps = patient.eps || 'Sin EPS'
                                  
                                  return (
                                    <SelectItem key={patient.id} value={patient.id}>
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src="/placeholder.svg" alt={patientName} />
                                          <AvatarFallback>
                                            {patientName
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase() || "??"}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{patientName}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {patientGender} • {patientEps}
                                          </p>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            {errors.patient_id && (
                              <p className="text-sm text-destructive flex items-center space-x-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{errors.patient_id}</span>
                              </p>
                            )}
                          </div>

                          {/* Physician Selection - Only show for owners */}
                          {isOwner() && (
                            <div className="space-y-2">
                              <Label htmlFor="physician">Médico Tratante *</Label>
                              <Select
                                value={formData.physician_id}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, physician_id: value }))}
                              >
                                <SelectTrigger className={errors.physician_id ? "border-destructive" : ""}>
                                  <SelectValue placeholder="Seleccionar médico" />
                                </SelectTrigger>
                                <SelectContent>
                                  {physicians.map((physician) => (
                                    <SelectItem key={physician.id} value={physician.id}>
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src="/placeholder.svg" alt={physician.name} />
                                          <AvatarFallback>
                                            {physician.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{physician.name}</p>
                                          <p className="text-xs text-muted-foreground">{physician.email}</p>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.physician_id && (
                                <p className="text-sm text-destructive flex items-center space-x-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>{errors.physician_id}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Selected Patient and Physician Display */}
                        {(selectedPatient || selectedPhysician) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={`grid grid-cols-1 ${isOwner() ? 'md:grid-cols-2' : ''} gap-4 p-4 bg-muted/50 rounded-lg border`}
                          >
                            {selectedPatient && (() => {
                              const patientName = selectedPatient.user?.name || selectedPatient.name || 'Sin nombre'
                              const patientGender = selectedPatient.user?.gender || 'No especificado'
                              const patientEps = selectedPatient.eps || 'Sin EPS'
                              
                              return (
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg" alt={patientName} />
                                    <AvatarFallback>
                                      {patientName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase() || "??"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold">{patientName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {patientGender} • {patientEps}
                                    </p>
                                  </div>
                                </div>
                              )
                            })()}
                            {selectedPhysician && (
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src="/placeholder.svg" alt={selectedPhysician.name} />
                                  <AvatarFallback>
                                    {selectedPhysician.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{selectedPhysician.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {isPhysician() ? 'Médico tratante' : selectedPhysician.email}
                                  </p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Update Medical History Option */}
                        <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Checkbox
                            id="update_medical_history"
                            checked={formData.update_medical_history}
                            onCheckedChange={(checked) => 
                              setFormData((prev) => ({ ...prev, update_medical_history: checked as boolean }))
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="update_medical_history"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              Actualizar Historia Médica
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Marque esta opción para actualizar el historial médico del paciente con esta información
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="clinical" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Stethoscope className="h-5 w-5" />
                          <span>Información Clínica</span>
                        </CardTitle>
                        <CardDescription>Síntomas, diagnóstico, tratamiento y observaciones médicas</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Symptoms */}
                        <div className="space-y-2">
                          <Label htmlFor="symptoms">Síntomas *</Label>
                          <Textarea
                            id="symptoms"
                            placeholder="Describa los síntomas presentados por el paciente..."
                            value={formData.symptoms}
                            onChange={(e) => setFormData((prev) => ({ ...prev, symptoms: e.target.value }))}
                            className={`min-h-[100px] ${errors.symptoms ? "border-destructive" : ""}`}
                          />
                          {errors.symptoms && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{errors.symptoms}</span>
                            </p>
                          )}
                        </div>

                        {/* Diagnosis */}
                        <div className="space-y-2">
                          <Label htmlFor="diagnosis">Diagnóstico *</Label>
                          <Textarea
                            id="diagnosis"
                            placeholder="Indique el diagnóstico médico..."
                            value={formData.diagnosis}
                            onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                            className={`min-h-[100px] ${errors.diagnosis ? "border-destructive" : ""}`}
                          />
                          {errors.diagnosis && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{errors.diagnosis}</span>
                            </p>
                          )}
                        </div>

                        {/* Treatment */}
                        <div className="space-y-2">
                          <Label htmlFor="treatment">Tratamiento *</Label>
                          <Textarea
                            id="treatment"
                            placeholder="Describa el tratamiento recomendado..."
                            value={formData.treatment}
                            onChange={(e) => setFormData((prev) => ({ ...prev, treatment: e.target.value }))}
                            className={`min-h-[100px] ${errors.treatment ? "border-destructive" : ""}`}
                          />
                          {errors.treatment && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{errors.treatment}</span>
                            </p>
                          )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notas Médicas</Label>
                          <Textarea
                            id="notes"
                            placeholder="Observaciones adicionales, notas importantes..."
                            value={formData.notes}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>Historia Médica</span>
                        </CardTitle>
                        <CardDescription>Información sobre la historia médica del paciente</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Consult Reason */}
                        <div className="space-y-2">
                          <Label htmlFor="consult_reason">Motivo de Consulta</Label>
                          <Textarea
                            id="consult_reason"
                            placeholder="¿Por qué viene el paciente a consulta?"
                            value={formData.consult_reason}
                            onChange={(e) => setFormData((prev) => ({ ...prev, consult_reason: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-2">
                          <Label htmlFor="personal_info">Información Personal</Label>
                          <Textarea
                            id="personal_info"
                            placeholder="Información personal relevante del paciente..."
                            value={formData.personal_info}
                            onChange={(e) => setFormData((prev) => ({ ...prev, personal_info: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Family Info */}
                        <div className="space-y-2">
                          <Label htmlFor="family_info">Información Familiar</Label>
                          <Textarea
                            id="family_info"
                            placeholder="Historia familiar médica relevante..."
                            value={formData.family_info}
                            onChange={(e) => setFormData((prev) => ({ ...prev, family_info: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Observations */}
                        <div className="space-y-2">
                          <Label htmlFor="observations">Observaciones</Label>
                          <Textarea
                            id="observations"
                            placeholder="Observaciones adicionales sobre el historial médico..."
                            value={formData.observations}
                            onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="allergies" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <span>Alergias</span>
                        </CardTitle>
                        <CardDescription>Información sobre alergias conocidas del paciente</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Alergias Conocidas</Label>
                          <Textarea
                            id="allergies"
                            placeholder="Describa las alergias conocidas del paciente a medicamentos, alimentos, sustancias, etc. Si no tiene alergias conocidas, indique 'Ninguna alergia conocida'..."
                            value={formData.allergies}
                            onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                            className="min-h-[150px]"
                          />
                          <p className="text-xs text-muted-foreground">
                            Esta información es crítica para la seguridad del paciente. Actualice si es necesario.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="prescriptions" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <Pill className="h-5 w-5" />
                              <span>Prescripciones Médicas</span>
                            </CardTitle>
                            <CardDescription>Medicamentos y tratamientos prescritos al paciente</CardDescription>
                          </div>
                          <Button onClick={addPrescription}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Medicamento
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {formData.prescriptions.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                              <Pill className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No hay prescripciones agregadas</h3>
                            <p className="text-muted-foreground mb-4">
                              Agregue los medicamentos que desea prescribir al paciente
                            </p>
                            <Button onClick={addPrescription}>
                              <Plus className="mr-2 h-4 w-4" />
                              Agregar Primera Prescripción
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <AnimatePresence>
                              {formData.prescriptions.map((prescription, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="p-6 border rounded-lg space-y-4"
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold flex items-center space-x-2">
                                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                      </div>
                                      <span>Prescripción {index + 1}</span>
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removePrescription(index)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                      <Label>Medicamento</Label>
                                      <Input
                                        placeholder="Nombre del medicamento"
                                        value={prescription.medicine}
                                        onChange={(e) => updatePrescription(index, "medicine", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Dosis</Label>
                                      <Input
                                        placeholder="ej: 500mg"
                                        value={prescription.dosage}
                                        onChange={(e) => updatePrescription(index, "dosage", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Frecuencia</Label>
                                      <Input
                                        placeholder="ej: Cada 6 horas"
                                        value={prescription.frequency}
                                        onChange={(e) => updatePrescription(index, "frequency", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Duración</Label>
                                      <Input
                                        placeholder="ej: 5 días"
                                        value={prescription.duration}
                                        onChange={(e) => updatePrescription(index, "duration", e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Instrucciones</Label>
                                    <Textarea
                                      placeholder="Instrucciones detalladas para el paciente..."
                                      value={prescription.instructions}
                                      onChange={(e) => updatePrescription(index, "instructions", e.target.value)}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
