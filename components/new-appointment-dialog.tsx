"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Video, AlertCircle } from "lucide-react"

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

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentTypes: any[]
  appointmentLocations: any[]
  onAppointmentCreated?: () => void
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  appointmentTypes,
  appointmentLocations,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [physicians, patientsData] = await Promise.all([
          physicianService.getAllPhysicians(),
          patientService.getAllPatients()
        ])
        setProviders(physicians)
        setPatients(patientsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!selectedPatient) newErrors.patient = "Patient is required"
    if (!selectedProvider) newErrors.provider = "Provider is required"
    if (!selectedType) newErrors.type = "Appointment type is required"
    if (!selectedLocation) newErrors.location = "Location is required"
    if (!date) newErrors.date = "Date is required"
    if (!startTime) newErrors.startTime = "Start time is required"
    if (!endTime) newErrors.endTime = "End time is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Get the selected appointment type to use as reason
      const selectedAppointmentType = appointmentTypes.find(t => t.id === selectedType)
      
      // Get the selected provider to get their clinic_id
      const selectedProviderData = providers.find(p => p.physician_id === selectedProvider)

      console.log('Creating appointment with data:', {
        patient_id: selectedPatient,
        physician_id: selectedProvider,
        clinic_id: selectedProviderData?.clinic_id || selectedLocation,
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: startTime,
        status: "pending",
        reason: selectedAppointmentType?.name || selectedType,
      })

      await appointmentService.createAppointment({
        patient_id: selectedPatient,
        physician_id: selectedProvider,
        clinic_id: selectedProviderData?.clinic_id || selectedLocation,
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: startTime,
        status: "pending",
        reason: selectedAppointmentType?.name || selectedType,
      })

      console.log('Appointment created successfully')
      
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
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className={errors.startTime ? "border-red-500" : ""}
              />
              {errors.startTime && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.startTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="location">Location</Label>
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location" className={errors.location ? "border-red-500" : ""}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {appointmentLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span>{location.name}</span>
                        <span className="text-xs text-slate-500">{location.address}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.location}
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
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Creating..." : "Schedule Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
