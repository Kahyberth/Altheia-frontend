"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO, isSameDay, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns"
import { Video, User, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppointmentCalendarViewProps {
  appointments: any[]
  patients: any[]
  providers: any[]
  appointmentTypes: any[]
  appointmentLocations: any[]
  selectedDate: Date
  viewMode: "day" | "week" | "list"
  weekStartDate: Date
  onSelectAppointment: (id: string) => void
  selectedAppointment: string | null
}

export function AppointmentCalendarView({
  appointments,
  patients,
  providers,
  appointmentTypes,
  appointmentLocations,
  selectedDate,
  viewMode,
  weekStartDate,
  onSelectAppointment,
  selectedAppointment,
}: AppointmentCalendarViewProps) {
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [weekDays, setWeekDays] = useState<Date[]>([])

  // Generate time slots from 8:00 AM to 6:00 PM
  useEffect(() => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        slots.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    setTimeSlots(slots)
  }, [])

  // Generate week days for week view
  useEffect(() => {
    if (viewMode === "week") {
      const start = startOfWeek(weekStartDate, { weekStartsOn: 1 }) // Start from Monday
      const end = endOfWeek(weekStartDate, { weekStartsOn: 1 }) // End on Sunday
      const days = eachDayOfInterval({ start, end })
      setWeekDays(days)
    }
  }, [viewMode, weekStartDate])

  // Filter appointments for the selected day
  const dayAppointments = appointments.filter((appointment) => {
    return isSameDay(parseISO(appointment.date), selectedDate)
  }).sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Get appointment details
  const getAppointmentDetails = (appointment: any) => {
    const patient = patients.find((p) => p.id === appointment.patientId)
    const provider = providers.find((p) => p.id === appointment.providerId)
    const type = appointmentTypes.find((t) => t.id === appointment.type)
    const location = appointmentLocations.find((l) => l.id === appointment.location)

    return {
      ...appointment,
      patient,
      provider,
      type,
      location,
    }
  }

  // Check if a time slot has an appointment
  const getAppointmentsForTimeSlot = (timeSlot: string, date: Date) => {
    return appointments.filter((appointment) => {
      return (
        isSameDay(parseISO(appointment.date), date) &&
        appointment.startTime === timeSlot
      )
    })
  }

  // Format time for display
  const formatTime = (time: string) => {
    // time is always in 'HH:mm' 24-hour format
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "scheduled":
        return { bgColor: "bg-blue-100", textColor: "text-blue-600", borderColor: "border-blue-200" }
      case "confirmed":
        return { bgColor: "bg-green-100", textColor: "text-green-600", borderColor: "border-green-200" }
      case "checked-in":
        return { bgColor: "bg-purple-100", textColor: "text-purple-600", borderColor: "border-purple-200" }
      case "completed":
        return { bgColor: "bg-cyan-100", textColor: "text-cyan-600", borderColor: "border-cyan-200" }
      case "cancelled":
        return { bgColor: "bg-red-100", textColor: "text-red-600", borderColor: "border-red-200" }
      default:
        return { bgColor: "bg-slate-100", textColor: "text-slate-600", borderColor: "border-slate-200" }
    }
  }

  // Generate dynamic time slots: combine default slots and all appointment start times
  const appointmentTimes = dayAppointments.map(a => a.startTime)
  const allSlotsSet = new Set([...timeSlots, ...appointmentTimes])
  const allSlots = Array.from(allSlotsSet).sort((a, b) => a.localeCompare(b))

  if (viewMode === "day") {
    return (
      <div className="space-y-4">
        {/* Show all appointments for the day in their respective slot */}
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="space-y-4">
            {allSlots.map((timeSlot) => (
              <div key={timeSlot} className="h-24 text-xs text-slate-500 pt-1">
                {formatTime(timeSlot)}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {allSlots.map((timeSlot) => {
              const slotAppointments = dayAppointments.filter(a => a.startTime === timeSlot)
              return (
                <div key={timeSlot} className="relative h-24 border-t border-slate-200">
                  <AnimatePresence>
                    {slotAppointments.map((appointment) => {
                      const details = getAppointmentDetails(appointment)
                      const statusStyles = getStatusStyles(appointment.status)
                      return (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`absolute inset-x-0 z-10 rounded-md border p-2 flex items-center gap-3 cursor-pointer ${statusStyles.bgColor} ${statusStyles.borderColor} ${selectedAppointment === appointment.id ? "ring-2 ring-blue-500" : ""}`}
                          style={{ height: "6rem" }}
                          onClick={() => onSelectAppointment(appointment.id)}
                        >
                          <span className="font-medium w-16">{formatTime(appointment.startTime)}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={details.patient?.avatar || "/placeholder.svg"} alt={details.patient?.name} />
                            <AvatarFallback>
                              {details.patient?.name?.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{details.patient?.name}</span>
                          <span className="text-xs text-slate-500">{details.provider?.name}</span>
                          <span className="text-xs text-slate-500">{details.type?.name}</span>
                          <Badge variant="outline" className={`${statusStyles.bgColor} ${statusStyles.textColor} ml-auto`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  } else if (viewMode === "week") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1">
          <div className="h-12"></div>
          {weekDays.map((day) => (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex flex-col items-center justify-center h-12 rounded-md ${
                isSameDay(day, new Date()) ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div className="text-xs">{format(day, "MMM d")}</div>
            </div>
          ))}
        </div>

        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1">
            {timeSlots.map((timeSlot) => (
              <React.Fragment key={timeSlot}>
                <div className="h-24 text-xs text-slate-500 pt-1">{formatTime(timeSlot)}</div>
                {weekDays.map((day) => {
                  const slotAppointments = getAppointmentsForTimeSlot(timeSlot, day)

                  return (
                    <div key={format(day, "yyyy-MM-dd")} className="relative h-24 border-t border-slate-200">
                      <AnimatePresence>
                        {slotAppointments.map((appointment) => {
                          const details = getAppointmentDetails(appointment)
                          const statusStyles = getStatusStyles(appointment.status)

                          return (
                            <motion.div
                              key={appointment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`absolute inset-x-0 z-10 rounded-md border p-2 cursor-pointer ${
                                statusStyles.bgColor
                              } ${statusStyles.borderColor} ${
                                selectedAppointment === appointment.id ? "ring-2 ring-blue-500" : ""
                              }`}
                              style={{ height: "6rem" }}
                              onClick={() => onSelectAppointment(appointment.id)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">{formatTime(appointment.startTime)}</span>
                                {appointment.isVirtual && <Video className="h-3 w-3 text-blue-500" />}
                              </div>
                              <div className="mt-1 flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={details.patient?.avatar || "/placeholder.svg"}
                                    alt={details.patient?.name}
                                  />
                                  <AvatarFallback>
                                    {details.patient?.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium truncate">{details.patient?.name}</span>
                              </div>
                              <div className="mt-1 text-xs truncate">{details.type?.name}</div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return null
}
