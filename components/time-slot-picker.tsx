"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TimeSlotPickerProps {
  selectedTime: string
  onTimeSelect: (time: string) => void
  occupiedTimes: string[]
  selectedDate?: Date // Add selected date prop
  workingHours?: {
    start: string
    end: string
  }
  slotDuration?: number // in minutes
  disabled?: boolean
}

export function TimeSlotPicker({
  selectedTime,
  onTimeSelect,
  occupiedTimes = [],
  selectedDate,
  workingHours = { start: "08:00", end: "18:00" },
  slotDuration = 30,
  disabled = false
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  // Generate time slots based on working hours and slot duration
  useEffect(() => {
    const slots: string[] = []
    const [startHour, startMinute] = workingHours.start.split(":").map(Number)
    const [endHour, endMinute] = workingHours.end.split(":").map(Number)
    
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    for (let time = startTime; time < endTime; time += slotDuration) {
      const hours = Math.floor(time / 60)
      const minutes = time % 60
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      slots.push(formattedTime)
    }
    
    setTimeSlots(slots)
  }, [workingHours, slotDuration])

  // Check if a time slot is occupied
  const isOccupied = (time: string): boolean => {
    return occupiedTimes.includes(time)
  }

  // Check if a time slot is in the past (only for today's appointments)
  const isPastTime = (time: string): boolean => {
    if (!selectedDate) return false
    
    const now = new Date()
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    const todayStr = now.toISOString().split('T')[0]
    
    // Only consider times as "past" if it's the same day as today
    if (selectedDateStr !== todayStr) return false
    
    const slotTime = new Date(`${selectedDateStr}T${time}:00`)
    return slotTime < now
  }

  // Format time for display (12-hour format)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHour = hours % 12 || 12
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  // Get time slot status
  const getSlotStatus = (time: string) => {
    if (isOccupied(time)) return 'occupied'
    if (isPastTime(time)) return 'past'
    return 'available'
  }

  // Get slot styling based on status
  const getSlotStyles = (time: string) => {
    const status = getSlotStatus(time)
    const isSelected = selectedTime === time

    const baseStyles = "w-full justify-start text-left transition-all duration-200"
    
    if (isSelected) {
      return cn(baseStyles, "bg-blue-600 text-white hover:bg-blue-700")
    }

    switch (status) {
      case 'occupied':
        return cn(baseStyles, "bg-red-50 text-red-600 border-red-200 cursor-not-allowed opacity-60")
      case 'past':
        return cn(baseStyles, "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50")
      case 'available':
        return cn(baseStyles, "bg-green-50 text-green-700 border-green-200 hover:bg-green-100")
      default:
        return cn(baseStyles, "bg-white")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Seleccionar Horario
        </CardTitle>
        {occupiedTimes.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            {occupiedTimes.length} horario{occupiedTimes.length !== 1 ? 's' : ''} ocupado{occupiedTimes.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Disponible
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
            Ocupado
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-400 border-gray-200">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
            Pasado
          </Badge>
        </div>

        {/* Time Slots Grid */}
        <ScrollArea className="h-64">
          <div className="grid grid-cols-2 gap-2 pr-4">
            {timeSlots.map((time) => {
              const status = getSlotStatus(time)
              const isDisabled = disabled || status === 'occupied' || status === 'past'
              
              return (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  className={getSlotStyles(time)}
                  onClick={() => !isDisabled && onTimeSelect(time)}
                  disabled={isDisabled}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{formatTime(time)}</span>
                    {status === 'occupied' && (
                      <span className="text-xs opacity-75">Ocupado</span>
                    )}
                    {status === 'past' && (
                      <span className="text-xs opacity-75">Pasado</span>
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        {/* Selected time display */}
        {selectedTime && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Horario seleccionado: {formatTime(selectedTime)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 