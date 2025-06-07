"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MoreVertical, CheckCircle2, X, Calendar, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample appointment data
const appointments = [
  {
    id: 1,
    patient: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      initials: "SJ",
    },
    time: "9:00 AM",
    duration: "30 min",
    type: "Check-up",
    status: "confirmed",
    isVirtual: false,
  },
  {
    id: 2,
    patient: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      initials: "MC",
    },
    time: "10:30 AM",
    duration: "45 min",
    type: "Follow-up",
    status: "confirmed",
    isVirtual: true,
  },
  {
    id: 3,
    patient: {
      name: "Amanda Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=AR",
      initials: "AR",
    },
    time: "1:15 PM",
    duration: "60 min",
    type: "Consultation",
    status: "pending",
    isVirtual: false,
  },
  {
    id: 4,
    patient: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=DW",
      initials: "DW",
    },
    time: "3:00 PM",
    duration: "30 min",
    type: "Check-up",
    status: "confirmed",
    isVirtual: true,
  },
  {
    id: 5,
    patient: {
      name: "Emily Thompson",
      avatar: "/placeholder.svg?height=40&width=40&text=ET",
      initials: "ET",
    },
    time: "4:30 PM",
    duration: "45 min",
    type: "Follow-up",
    status: "confirmed",
    isVirtual: false,
  },
]

export function AppointmentList() {
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedAppointment(expandedAppointment === id ? null : id)
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-white"
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            onClick={() => toggleExpand(appointment.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} alt={appointment.patient.name} />
                <AvatarFallback>{appointment.patient.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{appointment.patient.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{appointment.time}</span>
                  <span>•</span>
                  <span>{appointment.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {appointment.isVirtual && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <Video className="mr-1 h-3 w-3" />
                  Virtual
                </Badge>
              )}
              <Badge
                variant={appointment.status === "confirmed" ? "outline" : "secondary"}
                className={
                  appointment.status === "confirmed"
                    ? "bg-green-50 text-green-700 hover:bg-green-50"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                }
              >
                {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <AnimatePresence>
            {expandedAppointment === appointment.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t p-3 bg-slate-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Appointment Type</p>
                      <p className="text-sm">{appointment.type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Patient ID</p>
                      <p className="text-sm">P-{1000 + appointment.id}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1 text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Check In</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 gap-1 text-blue-600">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Reschedule</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 gap-1 text-red-600">
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
