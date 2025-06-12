"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Stethoscope, Check } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"

interface AddServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddServices: (services: string[]) => void
  existingServices: string[]
}

const commonServices = [
  "Cardiología",
  "Medicina General",
  "Pediatría",
  "Ginecología",
  "Dermatología",
  "Oftalmología",
  "Otorrinolaringología",
  "Neurología",
  "Psiquiatría",
  "Psicología",
  "Fisioterapia",
  "Nutrición",
  "Electrocardiograma",
  "Ecocardiograma",
  "Holter 24h",
  "Prueba de Esfuerzo",
  "Radiología",
  "Ecografía",
  "Laboratorio Clínico",
  "Medicina Preventiva",
  "Consulta Externa",
  "Urgencias",
  "Cirugía Menor",
  "Vacunación",
  "Toma de Muestras",
]

export function AddServiceDialog({ open, onOpenChange, onAddServices, existingServices }: AddServiceDialogProps) {
  const [newService, setNewService] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const availableServices = commonServices.filter((service) => !existingServices.includes(service))

  const handleAddCustomService = () => {
    if (
      newService.trim() &&
      !selectedServices.includes(newService.trim()) &&
      !existingServices.includes(newService.trim())
    ) {
      setSelectedServices([...selectedServices, newService.trim()])
      setNewService("")
    }
  }

  const handleToggleService = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleRemoveSelected = (service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service))
  }

  const handleSubmit = () => {
    if (selectedServices.length > 0) {
      onAddServices(selectedServices)
      setSelectedServices([])
      setNewService("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedServices([])
    setNewService("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Añadir Servicios
          </DialogTitle>
          <DialogDescription>
            Selecciona los servicios que ofrece tu clínica o añade uno personalizado
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Custom Service Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-service">Servicio Personalizado</Label>
            <div className="flex gap-2">
              <Input
                id="custom-service"
                placeholder="Nombre del servicio..."
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomService()}
              />
              <Button onClick={handleAddCustomService} disabled={!newService.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Available Services */}
          {availableServices.length > 0 && (
            <div className="space-y-3">
              <Label>Servicios Disponibles</Label>
              <div className="grid gap-2 max-h-48 overflow-auto">
                {availableServices.map((service) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedServices.includes(service) ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleToggleService(service)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-50 p-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                    {selectedServices.includes(service) && <Check className="h-4 w-4 text-blue-600" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <div className="space-y-3">
              <Label>Servicios Seleccionados ({selectedServices.length})</Label>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedServices.map((service) => (
                    <motion.div
                      key={service}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="gap-1">
                        {service}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleRemoveSelected(service)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={selectedServices.length === 0}>
            Añadir {selectedServices.length > 0 && `(${selectedServices.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
