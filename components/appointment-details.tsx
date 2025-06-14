"use client"
import {
  Calendar,
  Clock,
  User,
  FileText,
  MapPin,
  Video,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  X,
  RefreshCw,
  Shield,
  History,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, parseISO } from "date-fns"
import { FrontendAppointment } from "@/app/dashboard/appointments/page"

interface AppointmentDetailsProps {
  appointment: FrontendAppointment
  onClose: () => void
  onCancel: (appointmentId: string) => void
}

export function AppointmentDetails({ appointment, onClose, onCancel }: AppointmentDetailsProps) {
  const canCancel = ["scheduled", "confirmed"].includes(appointment.status)
  const canCheckIn = ["scheduled", "confirmed"].includes(appointment.status)
  const canComplete = appointment.status === "checked-in"
  const canReschedule = ["scheduled", "confirmed"].includes(appointment.status)

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle>Appointment Details</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-xs sm:text-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="patient" className="text-xs sm:text-sm">
              Patient
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
                  <h3 className="mb-2 font-medium">Appointment Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Date & Time</p>
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
                      <p className="text-sm font-medium text-slate-500">Type</p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <p>{appointment.appointmentType}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Provider</p>
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
                      <p className="text-sm font-medium text-slate-500">Location</p>
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
                    <h3 className="mb-2 font-medium">Notes</h3>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Actions</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {canCheckIn && (
                      <Button variant="outline" className="justify-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Check In Patient
                      </Button>
                    )}
                    {canComplete && (
                      <Button variant="outline" className="justify-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-cyan-500" />
                        Mark as Completed
                      </Button>
                    )}
                    {canReschedule && (
                      <Button variant="outline" className="justify-start">
                        <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />
                        Reschedule
                      </Button>
                    )}
                    {canCancel && (
                      <Button variant="outline" className="justify-start" onClick={() => onCancel(appointment.id)}>
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Cancel Appointment
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
                  <h3 className="mb-2 font-medium">Contact Information</h3>
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
                  <h3 className="mb-2 font-medium">Patient Actions</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      View Medical Records
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                      View All Appointments
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Phone className="mr-2 h-4 w-4 text-blue-500" />
                      Call Patient
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Recent Appointments</h3>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-600">
                      <span>View all</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {[
                      {
                        date: "2025-05-10",
                        time: "09:00 AM",
                        type: "Check-up",
                        provider: "Dr. Rebecca Taylor",
                        status: "completed",
                      },
                      {
                        date: "2025-04-15",
                        time: "02:30 PM",
                        type: "Follow-up",
                        provider: "Dr. Rebecca Taylor",
                        status: "completed",
                      },
                    ].map((apt, index) => (
                      <div key={index} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <p className="text-sm font-medium">
                              {format(parseISO(apt.date), "MMM d, yyyy")} • {apt.time}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              apt.status === "completed" ? "bg-cyan-50 text-cyan-700" : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {formatStatus(apt.status)}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>{apt.type}</span>
                          <span>•</span>
                          <span>{apt.provider}</span>
                        </div>
                      </div>
                    ))}
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
          <span>HIPAA Compliant</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <History className="h-3.5 w-3.5" />
          <span>Last updated: {appointment.updatedAt ? format(parseISO(appointment.updatedAt), "MMM d, yyyy h:mm a") : "N/A"}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper functions
function formatTime(time: string) {
  // time is always in 'HH:mm' 24-hour format
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
