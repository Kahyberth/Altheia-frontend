"use client"
import {
  Calendar,
  Clock,
  User,
  FileText,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  X,
  RefreshCw,
  Shield,
  History,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, parseISO } from "date-fns"
import { FrontendAppointment } from "@/app/dashboard/appointments/page"
import { RescheduleAppointmentDialog } from "@/components/reschedule-appointment-dialog"
import { useState } from "react"

interface AppointmentDetailsProps {
  appointment: FrontendAppointment
  onClose: () => void
  onCancel: (appointmentId: string) => void
  onRescheduleSuccess?: () => void
}

export function AppointmentDetails({ appointment, onClose, onCancel, onRescheduleSuccess }: AppointmentDetailsProps) {
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  
  const canCancel = ["scheduled", "confirmed"].includes(appointment.status)
  const canCheckIn = ["scheduled", "confirmed"].includes(appointment.status)
  const canComplete = appointment.status === "checked-in"
  const canReschedule = ["scheduled", "confirmed"].includes(appointment.status)

  const handleReschedule = () => {
    setShowRescheduleDialog(true)
  }

  const handleRescheduleSuccess = () => {
    setShowRescheduleDialog(false)
    if (onRescheduleSuccess) {
      onRescheduleSuccess()
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle>Detalles de la cita</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-xs sm:text-sm">
              Detalles
            </TabsTrigger>
            <TabsTrigger value="patient" className="text-xs sm:text-sm">
              Paciente
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="details">
              <div className="space-y-4">
                <div className="flex items-center justify-end">
                  <Badge
                    variant="outline"
                    className={`${getAppointmentStatusStyles(appointment.status).badgeBgColor} ${
                      getAppointmentStatusStyles(appointment.status).badgeTextColor
                    }`}
                  >
                    {formatStatus(appointment.status)}
                  </Badge>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Información de la cita</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Fecha y hora</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <p>{format(parseISO(appointment.date), "MMMM d, yyyy")}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <p>{formatTime(appointment.startTime)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Tipo</p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <p>{appointment.appointmentType}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Proveedor</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <p>{appointment.provider?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <p>{appointment.provider?.specialty}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Ubicación</p>
                      <div className="flex items-center gap-2">
                        <p>{appointment.locationDetails?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <p>{appointment.locationDetails?.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Notas</h3>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Acciones</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {canComplete && (
                      <Button variant="outline" className="justify-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-cyan-500" />
                        Marcar como completado
                      </Button>
                    )}
                    {canReschedule && (
                      <Button variant="outline" className="justify-start" onClick={handleReschedule}>
                        <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />
                        Reagendar cita
                      </Button>
                    )}
                    {canCancel && (
                      <Button variant="outline" className="justify-start" onClick={() => onCancel(appointment.id)}>
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Cancelar cita
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="patient">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={appointment.patient?.avatar || "/placeholder.svg"}
                      alt={appointment.patient?.name}
                    />
                    <AvatarFallback>
                      {appointment.patient?.name?.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{appointment.patient?.name}</h3>
                    <p className="text-sm text-slate-500">
                      {appointment.patient?.age} • {appointment.patient?.gender}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Información de contacto</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{appointment.patient?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{appointment.patient?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Acciones del paciente</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      Ver historial médico
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                      Ver todas las citas
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4 mt-4">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5" />
          <span>Altheia EHR</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <History className="h-3.5 w-3.5" />
          <span>Last updated: {appointment.updatedAt ? format(parseISO(appointment.updatedAt), "MMM d, yyyy h:mm a") : "N/A"}</span>
        </div>
      </CardFooter>
      <RescheduleAppointmentDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        appointment={{
          id: appointment.id,
          doctor: appointment.provider?.name || "Unknown Doctor",
          specialty: appointment.provider?.specialty || "Unknown Specialty",
          date: format(parseISO(appointment.date), "EEEE, MMMM d, yyyy"),
          time: formatTime(appointment.startTime),
          location: appointment.locationDetails?.name || "Unknown Location",
          providerId: appointment.providerId,
        }}
        onRescheduleSuccess={handleRescheduleSuccess}
      />
    </Card>
  )
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours % 12 || 12;
  return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatStatus(status: string) {
  switch (status) {
    case "scheduled":
      return "Scheduled"
    case "confirmed":
      return "Confirmed"
    case "checked-in":
      return "Checked In"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

function getAppointmentStatusStyles(status: string) {
  switch (status) {
    case "scheduled":
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        badgeBgColor: "bg-blue-50",
        badgeTextColor: "text-blue-700",
      }
    case "confirmed":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        badgeBgColor: "bg-green-50",
        badgeTextColor: "text-green-700",
      }
    case "checked-in":
      return {
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        badgeBgColor: "bg-purple-50",
        badgeTextColor: "text-purple-700",
      }
    case "completed":
      return {
        bgColor: "bg-cyan-100",
        textColor: "text-cyan-600",
        badgeBgColor: "bg-cyan-50",
        badgeTextColor: "text-cyan-700",
      }
    case "cancelled":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        badgeBgColor: "bg-red-50",
        badgeTextColor: "text-red-700",
      }
    default:
      return {
        bgColor: "bg-slate-100",
        textColor: "text-slate-600",
        badgeBgColor: "bg-slate-50",
        badgeTextColor: "text-slate-700",
      }
  }
}
