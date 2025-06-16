"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { FrontendAppointment } from "@/app/dashboard/appointments/page"
import { format, isSameDay, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

interface EnhancedCalendarProps {
  mode?: "single" | "range"
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  appointments: FrontendAppointment[]
  className?: string
  disabled?: (date: Date) => boolean
}

export function EnhancedCalendar({
  mode = "single",
  selected,
  onSelect,
  appointments,
  className,
  disabled
}: EnhancedCalendarProps) {
  const [appointmentsByDate, setAppointmentsByDate] = useState<Record<string, FrontendAppointment[]>>({})

  // Group appointments by date
  useEffect(() => {
    const grouped: Record<string, FrontendAppointment[]> = {}
    
    appointments.forEach(appointment => {
      const dateKey = appointment.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(appointment)
    })
    
    setAppointmentsByDate(grouped)
  }, [appointments])

  // Get appointment count for a specific date
  const getAppointmentCount = (date: Date): number => {
    const dateKey = format(date, "yyyy-MM-dd")
    return appointmentsByDate[dateKey]?.length || 0
  }

  // Get appointment status summary for a date
  const getDateStatus = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    const dayAppointments = appointmentsByDate[dateKey] || []
    
    if (dayAppointments.length === 0) return null
    
    const statusCounts = dayAppointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Priority order for status display
    const statusPriority = ['cancelled', 'completed', 'checked-in', 'confirmed', 'scheduled']
    
    for (const status of statusPriority) {
      if (statusCounts[status]) {
        return {
          status,
          count: statusCounts[status],
          total: dayAppointments.length
        }
      }
    }
    
    return null
  }

  // Custom day content renderer
  const renderDayContent = (date: Date) => {
    const appointmentCount = getAppointmentCount(date)
    const dateStatus = getDateStatus(date)
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className={cn(
          "text-sm",
          selected && isSameDay(date, selected) ? "font-bold" : ""
        )}>
          {format(date, "d")}
        </span>
        
        {appointmentCount > 0 && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {appointmentCount <= 3 ? (
              // Show individual dots for small counts
              Array.from({ length: appointmentCount }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1 h-1 rounded-full",
                    dateStatus?.status === 'cancelled' ? "bg-red-500" :
                    dateStatus?.status === 'completed' ? "bg-green-500" :
                    dateStatus?.status === 'checked-in' ? "bg-purple-500" :
                    dateStatus?.status === 'confirmed' ? "bg-blue-500" :
                    "bg-orange-500"
                  )}
                />
              ))
            ) : (
              // Show count badge for many appointments
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs h-4 px-1 min-w-4",
                  dateStatus?.status === 'cancelled' ? "bg-red-100 text-red-700" :
                  dateStatus?.status === 'completed' ? "bg-green-100 text-green-700" :
                  dateStatus?.status === 'checked-in' ? "bg-purple-100 text-purple-700" :
                  dateStatus?.status === 'confirmed' ? "bg-blue-100 text-blue-700" :
                  "bg-orange-100 text-orange-700"
                )}
              >
                {appointmentCount}
              </Badge>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        className="rounded-md border"
      />
      
      {/* Appointment indicators below calendar */}
      <div className="mt-4 space-y-2">
        {Object.entries(appointmentsByDate).map(([dateKey, dayAppointments]) => {
          const date = parseISO(dateKey)
          const appointmentCount = dayAppointments.length
          const dateStatus = getDateStatus(date)
          
          return (
            <div key={dateKey} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
              <span className="font-medium">{format(date, "MMM d, yyyy")}</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline"
                  className={cn(
                    dateStatus?.status === 'cancelled' ? "bg-red-50 text-red-700 border-red-200" :
                    dateStatus?.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
                    dateStatus?.status === 'checked-in' ? "bg-purple-50 text-purple-700 border-purple-200" :
                    dateStatus?.status === 'confirmed' ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-orange-50 text-orange-700 border-orange-200"
                  )}
                >
                  {appointmentCount} cita{appointmentCount !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Leyenda de Estados</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>Programada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Confirmada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>En progreso</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Completada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Cancelada</span>
          </div>
        </div>
      </div>
    </div>
  )
} 