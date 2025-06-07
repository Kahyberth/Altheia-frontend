"use client"

import { useState } from "react"
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

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patients: any[]
  providers: any[]
  appointmentTypes: any[]
  appointmentLocations: any[]
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  patients,
  providers,
  appointmentTypes,
  appointmentLocations,
}: NewAppointmentDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("09:30")
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [isVirtual, setIsVirtual] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
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

    // In a real app, this would call an API to create the appointment
    console.log({
      patientId: selectedPatient,
      providerId: selectedProvider,
      date: date ? format(date, "yyyy-MM-dd") : "",
      startTime,
      endTime,
      type: selectedType,
      location: selectedLocation,
      notes,
      isVirtual,
    })

    // Reset form and close dialog
    resetForm()
    onOpenChange(false)
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
    setIsVirtual(false)
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
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
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
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                        <AvatarFallback>
                          {provider.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{provider.name}</span>
                        <span className="text-xs text-slate-500">{provider.specialty}</span>
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

            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={errors.endTime ? "border-red-500" : ""}
              />
              {errors.endTime && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.endTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVirtual"
                  checked={isVirtual}
                  onCheckedChange={(checked) => {
                    setIsVirtual(checked as boolean)
                    if (checked) {
                      // Set location to virtual if virtual is checked
                      const virtualLocation = appointmentLocations.find((loc) => loc.id === "virtual")
                      if (virtualLocation) {
                        setSelectedLocation(virtualLocation.id)
                      }
                    }
                  }}
                />
                <label
                  htmlFor="isVirtual"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Video className="mr-1 h-3.5 w-3.5 text-blue-500" />
                  Virtual Appointment
                </label>
              </div>
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={isVirtual}>
              <SelectTrigger id="location" className={errors.location ? "border-red-500" : ""}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {appointmentLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id} disabled={isVirtual && location.id !== "virtual"}>
                    <div className="flex items-center gap-2">
                      {location.id === "virtual" ? (
                        <Video className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-slate-500" />
                      )}
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
          <Button onClick={handleSubmit}>Schedule Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
