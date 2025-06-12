"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Stethoscope, ClipboardList, FlaskRoundIcon as Flask, UserCheck, CalendarIcon } from "lucide-react"

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
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onOpenChange(false)
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          <DialogDescription>{getFormDescription()}</DialogDescription>
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
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" placeholder="Nombre completo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select required>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+57 300 123 4567" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_number">Número de documento</Label>
                  <Input id="document_number" placeholder="1234567890" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Fecha de nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Physician specific fields */}
              {staffType === "physician" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="physician_specialty">Especialidad</Label>
                      <Select required>
                        <SelectTrigger id="physician_specialty">
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiología</SelectItem>
                          <SelectItem value="dermatology">Dermatología</SelectItem>
                          <SelectItem value="neurology">Neurología</SelectItem>
                          <SelectItem value="pediatrics">Pediatría</SelectItem>
                          <SelectItem value="orthopedics">Ortopedia</SelectItem>
                          <SelectItem value="gynecology">Ginecología</SelectItem>
                          <SelectItem value="ophthalmology">Oftalmología</SelectItem>
                          <SelectItem value="psychiatry">Psiquiatría</SelectItem>
                          <SelectItem value="general">Medicina General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_number">Número de licencia</Label>
                      <Input id="license_number" placeholder="MED2024-123" required />
                    </div>
                  </div>
                </>
              )}

              {/* Patient specific fields */}
              {staffType === "patient" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" placeholder="Calle 123 #45-67" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eps">EPS</Label>
                      <Select required>
                        <SelectTrigger id="eps">
                          <SelectValue placeholder="Seleccionar EPS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salud_total">Salud Total</SelectItem>
                          <SelectItem value="nueva_eps">Nueva EPS</SelectItem>
                          <SelectItem value="sura">Sura</SelectItem>
                          <SelectItem value="compensar">Compensar</SelectItem>
                          <SelectItem value="famisanar">Famisanar</SelectItem>
                          <SelectItem value="sanitas">Sanitas</SelectItem>
                          <SelectItem value="coomeva">Coomeva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Tipo de sangre</Label>
                    <Select required>
                      <SelectTrigger id="blood_type">
                        <SelectValue placeholder="Seleccionar tipo de sangre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
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
