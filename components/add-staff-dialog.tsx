"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Stethoscope, ClipboardList, FlaskRoundIcon as Flask, UserCheck, CalendarIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { getClinicInformation } from "@/services/clinic.service"
import { Services, EpsOffered } from "@/types/clinic"
import { createPhysicianService, createReceptionistService, createLabTechnicianService, createPatientService } from "@/services/auth.service"
import { addToast } from "@heroui/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AddStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffType: string
  onStaffTypeChange: (type: string) => void
}

export function AddStaffDialog({ open, onOpenChange, staffType, onStaffTypeChange }: AddStaffDialogProps) {
  const { user } = useAuth()
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clinicServices, setClinicServices] = useState<Services[]>([])
  const [clinicEps, setClinicEps] = useState<EpsOffered[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [clinicId, setClinicId] = useState<string>("")

  // Fetch clinic services when dialog opens
  useEffect(() => {
    const fetchClinicServices = async () => {
      if (!open || !user?.id) return
      
      setLoadingServices(true)
      try {
        const clinicRes = await getClinicInformation(user.id)
        const services = clinicRes.data?.information?.["services offered"] || []
        const eps = clinicRes.data?.information?.["eps offered"] || []
        const clinicIdFromRes = clinicRes.data?.clinic?.id || clinicRes.data?.information?.clinic_id
        setClinicServices(services)
        setClinicEps(eps)
        setClinicId(clinicIdFromRes || "")
      } catch (error) {
        console.error("Error fetching clinic data:", error)
        setClinicServices([])
        setClinicEps([])
        setClinicId("")
      } finally {
        setLoadingServices(false)
      }
    }

    fetchClinicServices()
  }, [open, user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      // Common fields for all staff types
      const genderValue = formData.get('gender') as string
      const genderMap: Record<string, string> = {
        'M': 'male',
        'F': 'female', 
        'O': 'other'
      }
      
      const commonData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        gender: genderMap[genderValue] || genderValue,
        phone: formData.get('phone') as string,
        document_number: formData.get('document_number') as string,
        date_of_birth: date ? date.toISOString().split('T')[0] : '',
        clinic_id: clinicId
      }

      let response
      
      switch (staffType) {
        case 'physician':
          const physicianData = {
            ...commonData,
            physician_specialty: formData.get('physician_specialty') as string,
            license_number: formData.get('license_number') as string
          }
          console.log('Creating physician with data:', physicianData)
          response = await createPhysicianService(physicianData)
          break
          
        case 'receptionist':
          const receptionistData = {
            name: commonData.name,
            email: commonData.email,
            password: commonData.password,
            gender: commonData.gender,
            phone: commonData.phone,
            document_number: commonData.document_number,
            clinic_id: commonData.clinic_id
          }
          console.log('Creating receptionist with data:', receptionistData)
          response = await createReceptionistService(receptionistData)
          break
          
        case 'laboratory':
          const labTechnicianData = {
            name: commonData.name,
            email: commonData.email,
            password: commonData.password,
            gender: commonData.gender,
            phone: commonData.phone,
            document_number: commonData.document_number,
            clinic_id: commonData.clinic_id
          }
          console.log('Creating lab technician with data:', labTechnicianData)
          response = await createLabTechnicianService(labTechnicianData)
          break
          
        case 'patient':
          const patientData = {
            name: commonData.name,
            email: commonData.email,
            password: commonData.password,
            gender: commonData.gender,
            phone: commonData.phone,
            document_number: commonData.document_number,
            date_of_birth: commonData.date_of_birth,
            address: formData.get('address') as string,
            eps: formData.get('eps') as string,
            blood_type: formData.get('blood_type') as string,
            clinic_id: commonData.clinic_id
          }
          console.log('Creating patient with data:', patientData)
          response = await createPatientService(patientData)
          break
          
        default:
          throw new Error('Invalid staff type')
      }

      console.log('Staff created successfully:', response)
      
      // Show success toast
      const staffTypeNames = {
        physician: 'Médico',
        receptionist: 'Recepcionista', 
        laboratory: 'Personal de laboratorio',
        patient: 'Paciente'
      }
      
      addToast({
        title: `${staffTypeNames[staffType as keyof typeof staffTypeNames]} creado`,
        description: `El ${staffTypeNames[staffType as keyof typeof staffTypeNames].toLowerCase()} se registró correctamente en el sistema.`
      })
      
      onOpenChange(false)
      
      // Reset form
      setDate(undefined)
      
    } catch (error) {
      console.error('Error creating staff:', error)
      
      // Show error toast
      addToast({
        title: "Error al crear personal",
        description: "No se pudo registrar el personal. Por favor intente nuevamente."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  }

  const getFormTitle = () => {
    const titles: Record<string, string> = {
      physician: "Añadir Médico",
      receptionist: "Añadir Recepcionista",
      laboratory: "Añadir Personal de Laboratorio",
      patient: "Registrar Paciente",
    }
    return titles[staffType] || "Añadir Personal"
  }

  const getFormDescription = () => {
    const descriptions: Record<string, string> = {
      physician: "Complete la información para registrar un nuevo médico en el sistema.",
      receptionist: "Ingrese los datos para añadir un nuevo recepcionista.",
      laboratory: "Registre un nuevo miembro del personal de laboratorio.",
      patient: "Complete el formulario para registrar un nuevo paciente.",
    }
    return descriptions[staffType] || "Ingrese la información del nuevo personal."
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{getFormTitle()}</DialogTitle>
          <DialogDescription className="dark:text-slate-400">{getFormDescription()}</DialogDescription>
        </DialogHeader>

        <Tabs value={staffType} onValueChange={onStaffTypeChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="physician" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Médico</span>
            </TabsTrigger>
            <TabsTrigger value="receptionist" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Recepcionista</span>
            </TabsTrigger>
            <TabsTrigger value="laboratory" className="flex items-center gap-2">
              <Flask className="h-4 w-4" />
              <span className="hidden sm:inline">Laboratorio</span>
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Paciente</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.form
              key={staffType}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Common fields for all staff types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-slate-300">Nombre completo</Label>
                  <Input id="name" name="name" placeholder="Nombre completo" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-slate-300">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-slate-300">Contraseña</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="dark:text-slate-300">Género</Label>
                  <Select name="gender" required>
                    <SelectTrigger id="gender" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="M" className="dark:text-white dark:focus:bg-slate-700">Masculino</SelectItem>
                      <SelectItem value="F" className="dark:text-white dark:focus:bg-slate-700">Femenino</SelectItem>
                      <SelectItem value="O" className="dark:text-white dark:focus:bg-slate-700">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-slate-300">Teléfono</Label>
                  <Input id="phone" name="phone" placeholder="+57 300 123 4567" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_number" className="dark:text-slate-300">Número de documento</Label>
                  <Input id="document_number" name="document_number" placeholder="1234567890" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="dark:text-slate-300">Fecha de nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600", !date && "text-muted-foreground dark:text-slate-400")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-slate-800 dark:border-slate-700">
                    <Calendar 
                      mode="single" 
                      selected={date} 
                      onSelect={setDate} 
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      classNames={{
                        dropdown_root: "dark:bg-slate-700 dark:border-slate-600",
                        dropdown: "dark:bg-slate-700 dark:text-white",
                        caption_label: "dark:text-white",
                        nav: "dark:text-white",
                        button_previous: "dark:text-white dark:hover:bg-slate-700",
                        button_next: "dark:text-white dark:hover:bg-slate-700",
                        table: "dark:text-white",
                        weekday: "dark:text-slate-400",
                        day: "dark:text-white dark:hover:bg-slate-700",
                        today: "dark:bg-slate-700 dark:text-white",
                        selected: "dark:bg-blue-600 dark:text-white"
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Physician specific fields */}
              {staffType === "physician" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="physician_specialty" className="dark:text-slate-300">Servicio/Especialidad</Label>
                      <Select name="physician_specialty" required disabled={loadingServices}>
                        <SelectTrigger id="physician_specialty" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                          <SelectValue placeholder={loadingServices ? "Cargando servicios..." : "Seleccionar servicio"} />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                          {clinicServices.length > 0 ? (
                            clinicServices.map((service) => (
                              <SelectItem key={service.id} value={service.id} className="dark:text-white dark:focus:bg-slate-700">
                                {service.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-services" disabled className="dark:text-slate-400">
                              No hay servicios configurados
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_number" className="dark:text-slate-300">Número de licencia</Label>
                      <Input id="license_number" name="license_number" placeholder="MED2024-123" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                  </div>
                </>
              )}

              {/* Patient specific fields */}
              {staffType === "patient" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="dark:text-slate-300">Dirección</Label>
                      <Input id="address" name="address" placeholder="Calle 123 #45-67" required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eps" className="dark:text-slate-300">EPS</Label>
                      <Select name="eps" required disabled={loadingServices}>
                        <SelectTrigger id="eps" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                          <SelectValue placeholder={loadingServices ? "Cargando EPS..." : "Seleccionar EPS"} />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                          {clinicEps.length > 0 ? (
                            clinicEps.map((eps) => (
                              <SelectItem key={eps.id} value={eps.id} className="dark:text-white dark:focus:bg-slate-700">
                                {eps.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-eps" disabled className="dark:text-slate-400">
                              No hay EPS configuradas
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blood_type" className="dark:text-slate-300">Tipo de sangre</Label>
                    <Select name="blood_type" required>
                      <SelectTrigger id="blood_type" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <SelectValue placeholder="Seleccionar tipo de sangre" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="A+" className="dark:text-white dark:focus:bg-slate-700">A+</SelectItem>
                        <SelectItem value="A-" className="dark:text-white dark:focus:bg-slate-700">A-</SelectItem>
                        <SelectItem value="B+" className="dark:text-white dark:focus:bg-slate-700">B+</SelectItem>
                        <SelectItem value="B-" className="dark:text-white dark:focus:bg-slate-700">B-</SelectItem>
                        <SelectItem value="AB+" className="dark:text-white dark:focus:bg-slate-700">AB+</SelectItem>
                        <SelectItem value="AB-" className="dark:text-white dark:focus:bg-slate-700">AB-</SelectItem>
                        <SelectItem value="O+" className="dark:text-white dark:focus:bg-slate-700">O+</SelectItem>
                        <SelectItem value="O-" className="dark:text-white dark:focus:bg-slate-700">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </DialogFooter>
            </motion.form>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
