"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Video, AlertCircle, Clock } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { appointmentService } from "@/services/appointment.service"
import { physicianService } from "@/services/physician"
import { patientService } from "@/services/patients"
import { Physician, Patient } from "@/services/appointment.service"
import { getPersonnelInClinic } from "@/services/clinic.service"
import { useAuth } from "@/context/AuthContext"
import { useRole } from "@/hooks/useRole"
import { TimeSlotPicker } from "@/components/time-slot-picker"

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentTypes: any[]
  onAppointmentCreated?: () => void
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  appointmentTypes,
  onAppointmentCreated,
}: NewAppointmentDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("09:30")
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [providers, setProviders] = useState<Physician[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const { user } = useAuth()
  const { isPatient } = useRole()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPersonnelInClinic(user?.clinic_id || "")
        console.log('Response from getPersonnelInClinic:', response)
        
        const personnel = (response.data as any)?.personnel || response.data
        console.log('Personnel data:', personnel)
        
        // Check if personnel is an array
        if (!Array.isArray(personnel)) {
          console.error('Personnel is not an array:', personnel)
          setProviders([])
          setPatients([])
          return
        }
        
        // Filtrar physicians (providers)
        const physicianData = personnel
          .filter(person => person.role === "physician")
          .map(person => ({
            user_id: person.id,
            physician_id: person.role_details?.physician_id || person.id,
            name: person.name,
            email: person.email,
            rol: person.role,
            user_status: person.status,
            gender: person.gender,
            last_login: person.last_login || "",
            physician_specialty: person.role_details?.physician_specialty || "General",
            physician_status: person.status,
            clinic_id: person.role_details?.clinic_id || user?.clinic_id
          }))
        
        // Filtrar patients
        const patientData = personnel
          .filter(person => person.role === "patient")
          .map(person => ({
            id: person.role_details?.patient_id || person.id,
            user_id: person.id,
            name: person.name,
            date_of_birth: person.role_details?.date_of_birth || "",
            address: person.role_details?.address || "",
            eps: person.role_details?.eps || "",
            blood_type: person.role_details?.blood_type || "",
            status: person.status,
            createdAt: person.created_at || "",
            updatedAt: person.updated_at || ""
          }))
        
        console.log('Processed physicians:', physicianData)
        console.log('Processed patients:', patientData)
        console.log('Current user:', user)
        console.log('Is patient:', isPatient())
        
        setProviders(physicianData)
        setPatients(patientData)
        
        // Auto-select current user if they are a patient
        if (isPatient()) {
          const currentPatient = patientData.find(p => p.user_id === user?.id)
          console.log('Found current patient:', currentPatient)
          console.log('Current patient ID vs user ID:', {
            patientId: currentPatient?.id,
            userId: currentPatient?.user_id,
            currentUserId: user?.id
          })
          if (currentPatient) {
            // Use the patient's ID (patient_id) for the appointment creation
            setSelectedPatient(currentPatient.id)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setProviders([])
        setPatients([])
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open, user?.clinic_id])

  // Función para cargar horarios ocupados
  const loadOccupiedTimes = async (physicianId: string, selectedDate: Date) => {
    if (!physicianId || !selectedDate) {
      setOccupiedTimes([])
      return
    }

    setIsCheckingAvailability(true)
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const occupied = await appointmentService.getOccupiedTimes(physicianId, dateStr)
      setOccupiedTimes(occupied)
      console.log('Occupied times for', dateStr, ':', occupied)
    } catch (error) {
      console.error('Error loading occupied times:', error)
      setOccupiedTimes([])
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Efecto para cargar horarios ocupados cuando cambia la fecha o proveedor
  useEffect(() => {
    if (selectedProvider && date) {
      loadOccupiedTimes(selectedProvider, date)
    } else {
      setOccupiedTimes([])
    }
  }, [selectedProvider, date])

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!selectedPatient) newErrors.patient = "Patient is required"
    if (!selectedProvider) newErrors.provider = "Provider is required"
    if (!selectedType) newErrors.type = "Appointment type is required"
    if (!date) newErrors.date = "Date is required"
    if (!startTime) newErrors.startTime = "Start time is required"
    if (!endTime) newErrors.endTime = "End time is required"

    // Validar conflictos de horario
    if (selectedProvider && date && startTime) {
      const dateStr = format(date, "yyyy-MM-dd")
      const selectedAppointmentType = appointmentTypes.find(t => t.id === selectedType)
      const duration = selectedAppointmentType?.duration || 30
      
      const hasConflict = await appointmentService.checkTimeConflict(
        selectedProvider, 
        dateStr, 
        startTime, 
        duration
      )
      
      if (hasConflict) {
        newErrors.startTime = "Este horario ya está ocupado. Por favor selecciona otro horario."
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Get the selected appointment type to use as reason
      const selectedAppointmentType = appointmentTypes.find(t => t.id === selectedType)
      
      const appointmentData = {
        patient_id: selectedPatient,
        physician_id: selectedProvider,
        clinic_id: user?.clinic_id || "",
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: startTime,
        status: "pending",
        reason: selectedAppointmentType?.name || selectedType,
      }
      
      console.log('Creating appointment with data:', appointmentData)
      console.log('Current user info:', {
        userId: user?.id,
        userRole: user?.role,
        isPatient: isPatient(),
        selectedPatientId: selectedPatient
      })

      const result = await appointmentService.createAppointment(appointmentData)
      
      console.log('Appointment created successfully. Result:', result)
      console.log('Created appointment ID:', result?.id)
      
      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
      
      // Notify parent component that an appointment was created
      if (onAppointmentCreated) {
        console.log('Calling onAppointmentCreated callback')
        onAppointmentCreated()
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      setErrors({
        submit: "Failed to create appointment. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setDate(new Date())
    setStartTime("09:00")
    setEndTime("09:30")
    setSelectedPatient("")
    setSelectedProvider("")
    setSelectedType("")
    setSelectedLocation("")
    setNotes("")
    setErrors({})
    setOccupiedTimes([])
    setIsCheckingAvailability(false)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)

    // Update end time based on appointment type duration
    const type = appointmentTypes.find((t) => t.id === value)
    if (type && startTime) {
      const [hours, minutes] = startTime.split(":").map(Number)
      const startMinutes = hours * 60 + minutes
      const endMinutes = startMinutes + type.duration
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60
      setEndTime(`${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`)
    }
  }

  const handleStartTimeChange = (value: string) => {
    setStartTime(value)

    // Update end time based on appointment type duration
    const type = appointmentTypes.find((t) => t.id === selectedType)
    if (type && value) {
      const [hours, minutes] = value.split(":").map(Number)
      const startMinutes = hours * 60 + minutes
      const endMinutes = startMinutes + type.duration
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60
      setEndTime(`${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>Fill in the details below to schedule a new appointment for a patient.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isPatient() && (
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger id="patient" className={errors.patient ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg" alt={patient.name} />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{patient.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {errors.patient && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.patient}
                </p>
              )}
            </div>
          )}
          
          {isPatient() && (
            <div className="grid gap-2">
              <Label>Paciente</Label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user?.name} />
                  <AvatarFallback>
                    {(user?.name || "")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.name}</span>
                <span className="text-sm text-gray-500">(Tú)</span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="provider">Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger id="provider" className={errors.provider ? "border-red-500" : ""}>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.physician_id} value={provider.physician_id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt={provider.name} />
                        <AvatarFallback>
                          {provider.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{provider.name}</span>
                        <span className="text-xs text-slate-500">{provider.physician_specialty}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.provider && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.provider}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${errors.date ? "border-red-500" : ""}`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent 
                    mode="single" 
                    selected={date} 
                    onSelect={(newDate) => {
                      setDate(newDate)
                      // Reset time selection when date changes
                      setStartTime("09:00")
                      setErrors(prev => ({ ...prev, startTime: '', date: '' }))
                    }}
                    initialFocus
                    disabled={(date) => {
                      // Disable past dates
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.date}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{type.name}</span>
                        <span className="text-xs text-slate-500">{type.duration} min</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.type}
                </p>
              )}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="grid gap-2">
            <Label>Horario de la Cita</Label>
            {selectedProvider && date ? (
              <TimeSlotPicker
                selectedTime={startTime}
                onTimeSelect={(time) => {
                  setStartTime(time)
                  handleStartTimeChange(time)
                  // Clear any previous time errors when selecting a new time
                  if (errors.startTime) {
                    setErrors(prev => ({ ...prev, startTime: '' }))
                  }
                }}
                occupiedTimes={occupiedTimes}
                selectedDate={date}
                workingHours={{ start: "08:00", end: "18:00" }}
                slotDuration={30}
                disabled={isCheckingAvailability}
              />
            ) : (
              <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Selecciona un médico y una fecha primero</p>
              </div>
            )}
            {errors.startTime && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.startTime}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading || isCheckingAvailability}>
            {isSubmitting ? "Creando..." : isCheckingAvailability ? "Verificando disponibilidad..." : "Programar Cita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
