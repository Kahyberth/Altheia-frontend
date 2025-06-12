"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Phone, Mail, Calendar, MapPin, FileText, User, Droplets, Building, Award } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StaffDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: any
  roleIcons: Record<string, React.ReactNode>
  roleColors: Record<string, string>
  statusColors: Record<string, string>
}

export function StaffDetailsDialog({
  open,
  onOpenChange,
  staff,
  roleIcons,
  roleColors,
  statusColors,
}: StaffDetailsDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Activo",
      inactive: "Inactivo",
      on_leave: "De permiso",
      registered: "Registrado",
    }
    return statusMap[status] || status
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      physician: "Médico",
      receptionist: "Recepcionista",
      laboratory: "Laboratorio",
      patient: "Paciente",
    }
    return roleMap[role] || role
  }

  // Mock data for demonstration
  const mockDetails = {
    physician: {
      date_of_birth: "1985-06-15",
      license_number: "MED2024-789",
      address: "Calle Principal 123, Bogotá",
      education: [
        { degree: "Doctor en Medicina", institution: "Universidad Nacional de Colombia", year: "2010" },
        { degree: "Especialización en Cardiología", institution: "Universidad de los Andes", year: "2014" },
      ],
      appointments_today: 8,
      patients_total: 1245,
    },
    receptionist: {
      date_of_birth: "1990-03-22",
      address: "Avenida 7 #45-12, Bogotá",
      start_date: "2022-01-15",
      appointments_scheduled: 2456,
      shift: "Mañana (7:00 AM - 3:00 PM)",
    },
    laboratory: {
      date_of_birth: "1988-11-05",
      address: "Carrera 15 #34-56, Bogotá",
      specialization: "Análisis Clínicos",
      start_date: "2021-06-10",
      tests_processed: 5678,
    },
    patient: {
      date_of_birth: "2008-05-12",
      address: "Calle 123 #45-67, Bogotá, Colombia",
      eps: "Salud Total",
      blood_type: "O+",
      last_visit: "2023-11-15",
      upcoming_appointment: "2023-12-05 10:30 AM",
      medical_conditions: ["Asma leve", "Alergia a penicilina"],
    },
  }

  // Cast to any to allow accessing role-specific properties without TypeScript union errors
  const details: any = mockDetails[staff.role as keyof typeof mockDetails] || {}

  const infoItems = [
    { icon: Mail, label: "Email", value: staff.email },
    { icon: Phone, label: "Teléfono", value: staff.phone },
    { icon: Calendar, label: "Fecha de nacimiento", value: details.date_of_birth },
    { icon: MapPin, label: "Dirección", value: details.address },
  ]

  // Role-specific info items
  const roleSpecificItems = {
    physician: [{ icon: Award, label: "Licencia", value: details.license_number }],
    patient: [
      { icon: Building, label: "EPS", value: details.eps },
      { icon: Droplets, label: "Tipo de sangre", value: details.blood_type },
    ],
    receptionist: [{ icon: Calendar, label: "Fecha de inicio", value: details.start_date }],
    laboratory: [
      { icon: FileText, label: "Especialización", value: details.specialization },
      { icon: Calendar, label: "Fecha de inicio", value: details.start_date },
    ],
  }

  const specificItems = roleSpecificItems[staff.role as keyof typeof roleSpecificItems] || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Personal</DialogTitle>
          <DialogDescription>Información completa del miembro del personal.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-4">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">{getInitials(staff.name)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{staff.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={`${roleColors[staff.role]} flex items-center gap-1`}>
              {roleIcons[staff.role]}
              {getRoleLabel(staff.role)}
            </Badge>
            <Badge variant="outline" className={statusColors[staff.status]}>
              {getStatusLabel(staff.status)}
            </Badge>
          </div>
          {staff.specialty && <p className="text-muted-foreground mt-1">{staff.specialty}</p>}
        </div>

        <Separator />

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Información</TabsTrigger>
            {staff.role === "physician" && <TabsTrigger value="education">Educación</TabsTrigger>}
            {staff.role === "patient" && <TabsTrigger value="medical">Historial</TabsTrigger>}
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...infoItems, ...specificItems].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value || "No disponible"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {staff.role === "physician" && (
            <TabsContent value="education" className="space-y-4">
              {details.education?.map((edu: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm">{edu.year}</p>
                </motion.div>
              ))}
            </TabsContent>
          )}

          {staff.role === "patient" && (
            <TabsContent value="medical" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Condiciones médicas</h3>
                <div className="flex flex-wrap gap-2">
                  {details.medical_conditions?.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium">Última visita</h3>
                  <p className="text-sm">{details.last_visit}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium">Próxima cita</h3>
                  <p className="text-sm">{details.upcoming_appointment}</p>
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.role === "physician" && (
                <>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Citas hoy</p>
                    <p className="text-3xl font-bold text-blue-600">{details.appointments_today}</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total pacientes</p>
                    <p className="text-3xl font-bold text-blue-600">{details.patients_total}</p>
                  </div>
                </>
              )}
              {staff.role === "receptionist" && (
                <>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Citas programadas</p>
                    <p className="text-3xl font-bold text-blue-600">{details.appointments_scheduled}</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Turno</p>
                    <p className="text-xl font-bold text-blue-600">{details.shift}</p>
                  </div>
                </>
              )}
              {staff.role === "laboratory" && (
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Pruebas procesadas</p>
                  <p className="text-3xl font-bold text-blue-600">{details.tests_processed}</p>
                </div>
              )}
              {staff.role === "patient" && (
                <>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total visitas</p>
                    <p className="text-3xl font-bold text-blue-600">12</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Última actualización</p>
                    <p className="text-xl font-bold text-blue-600">Hace 2 semanas</p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <User className="mr-2 h-4 w-4" />
            Editar información
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
