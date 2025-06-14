"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MoreVertical, CheckCircle2, X, Calendar, Video, ChevronRight } from "lucide-react"

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
      {appointments.map((appointment, index) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => toggleExpand(appointment.id)}
        >
          <div className="relative">
                         <Avatar className="h-10 w-10">
               <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} />
               <AvatarFallback className="bg-blue-500 text-white">
                 {appointment.patient.initials}
               </AvatarFallback>
             </Avatar>
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-800 ${
              appointment.status === "confirmed" ? "bg-green-500" :
              appointment.status === "pending" ? "bg-yellow-500" :
              appointment.status === "cancelled" ? "bg-red-500" : "bg-gray-500"
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {appointment.patient.name}
              </p>
              <time className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                {appointment.time}
              </time>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {appointment.type}
              </p>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  appointment.status === "confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                  appointment.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                  appointment.status === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {appointment.status}
              </Badge>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      ))}
      
      {appointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No hay citas programadas</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Las citas de hoy aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}
