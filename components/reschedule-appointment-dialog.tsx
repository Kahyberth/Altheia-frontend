"use client";

import { useState, useEffect } from "react";
import { format, addDays, addMinutes, startOfDay, endOfDay } from "date-fns";
import { Calendar, Clock, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { appointmentService } from "@/services/appointment.service";
import { addToast } from "@heroui/react";

interface RescheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: {
    id: string;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    location: string;
    providerId?: string;
  } | null;
  onRescheduleSuccess?: () => void;
}

export function RescheduleAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onRescheduleSuccess,
}: RescheduleAppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Generate time slots from 8:00 AM to 6:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Load occupied times when date changes
  useEffect(() => {
    const loadOccupiedTimes = async () => {
      if (!selectedDate || !appointment?.providerId) return;

      setIsLoadingTimes(true);
      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        console.log(`Loading occupied times for physician ${appointment.providerId} on ${dateString}`);
        
        const occupied = await appointmentService.getOccupiedTimes(
          appointment.providerId, 
          dateString, 
          appointment.id // Exclude current appointment from occupied times
        );
        console.log(`Found ${occupied.length} occupied times:`, occupied);
        
        setOccupiedTimes(occupied);
      } catch (error) {
        console.error("Error loading occupied times:", error);
        setOccupiedTimes([]);
        addToast({
          title: "Error",
          description: "No se pudieron cargar los horarios ocupados. Algunos horarios pueden estar duplicados."
        });
      } finally {
        setIsLoadingTimes(false);
      }
    };

    loadOccupiedTimes();
  }, [selectedDate, appointment?.providerId]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedDate(undefined);
      setSelectedTime("");
      setOccupiedTimes([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!appointment || !selectedDate || !selectedTime) {
      addToast({
        title: "Error",
        description: "Por favor selecciona una fecha y hora válidas."
      });
      return;
    }

    // Check if selected time is available
    if (!isTimeAvailable(selectedTime)) {
      addToast({
        title: "Error",
        description: "El horario seleccionado no está disponible. Por favor elige otro horario."
      });
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours, minutes, 0, 0);

    // Check if the new date/time is in the future
    if (newDateTime <= new Date()) {
      addToast({
        title: "Error",
        description: "La fecha y hora seleccionadas deben ser en el futuro."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(`Rescheduling appointment ${appointment.id} to ${newDateTime.toISOString()}`);
      
      await appointmentService.rescheduleAppointment(
        appointment.id,
        newDateTime.toISOString()
      );

      addToast({
        title: "Cita reagendada exitosamente",
        description: `Tu cita ha sido reagendada para el ${format(newDateTime, "dd/MM/yyyy")} a las ${format(newDateTime, "HH:mm")}`
      });

      onOpenChange(false);
      if (onRescheduleSuccess) {
        onRescheduleSuccess();
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      addToast({
        title: "Error",
        description: "No se pudo reagendar la cita. Inténtalo de nuevo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const isTimeAvailable = (time: string) => {
    return !occupiedTimes.includes(time);
  };

  // Count available vs occupied times
  const availableCount = timeSlots.filter(time => isTimeAvailable(time)).length;
  const occupiedCount = timeSlots.filter(time => !isTimeAvailable(time)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reagendar Cita
          </DialogTitle>
          <DialogDescription>
            {appointment && (
              <>Reagenda tu cita con {appointment.doctor} ({appointment.specialty})</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Appointment Info */}
          {appointment && (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                Cita Actual
              </h4>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>📅 {appointment.date}</p>
                <p>🕒 {appointment.time}</p>
                <p>🏥 {appointment.location}</p>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Nueva Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < addDays(new Date(), 1)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="time">Nueva Hora</Label>
              {selectedDate && !isLoadingTimes && (
                <div className="text-xs text-slate-500">
                  {availableCount} disponibles, {occupiedCount} ocupados
                </div>
              )}
            </div>
            
            {/* Availability Legend */}
            {selectedDate && !isLoadingTimes && (
              <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Ocupado</span>
                </div>
              </div>
            )}
            
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTimes ? "Cargando horarios..." : "Selecciona una hora"} />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => {
                  const available = isTimeAvailable(time);
                  return (
                    <SelectItem
                      key={time}
                      value={time}
                      disabled={!available}
                      className={!available ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <Clock className="h-4 w-4" />
                          {formatTime(time)}
                        </div>
                        <span className={`text-xs ml-2 ${available ? 'text-green-600' : 'text-red-600'}`}>
                          {available ? "Disponible" : "Ocupado"}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedDate && isLoadingTimes && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-500"></div>
                Verificando disponibilidad...
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || isSubmitting || !isTimeAvailable(selectedTime)}
          >
            {isSubmitting ? "Reagendando..." : "Reagendar Cita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 