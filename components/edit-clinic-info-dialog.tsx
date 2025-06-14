"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Save } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClinicEditForm } from "@/types/clinic"

interface EditClinicInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clinicInfo: ClinicEditForm
  onUpdateInfo: (updatedInfo: Partial<ClinicEditForm>) => void
}

export function EditClinicInfoDialog({ open, onOpenChange, clinicInfo, onUpdateInfo }: EditClinicInfoDialogProps) {
  const [formData, setFormData] = useState<ClinicEditForm>(clinicInfo)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFormData(clinicInfo)
  }, [clinicInfo])

  const handleInputChange = (field: keyof ClinicEditForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onUpdateInfo(formData)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData(clinicInfo)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Editar Información de la Clínica
          </DialogTitle>
          <DialogDescription>Actualiza la información general, datos del propietario y ubicación</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="clinic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clinic">Información de la Clínica</TabsTrigger>
              <TabsTrigger value="location">Ubicación</TabsTrigger>
            </TabsList>

            <TabsContent value="clinic">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 lg:grid-cols-2"
              >
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Nombre de la Clínica *</Label>
                  <Input
                    id="clinic-name"
                    value={formData.clinic_name}
                    onChange={(e) => handleInputChange("clinic_name", e.target.value)}
                    placeholder="Centro Médico..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-email">Email *</Label>
                  <Input
                    id="clinic-email"
                    type="email"
                    value={formData.clinic_email}
                    onChange={(e) => handleInputChange("clinic_email", e.target.value)}
                    placeholder="info@clinica.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-phone">Teléfono *</Label>
                  <Input
                    id="clinic-phone"
                    value={formData.clinic_phone}
                    onChange={(e) => handleInputChange("clinic_phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-website">Sitio Web</Label>
                  <Input
                    id="clinic-website"
                    value={formData.clinic_website}
                    onChange={(e) => handleInputChange("clinic_website", e.target.value)}
                    placeholder="https://clinica.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-count">Número de Personal</Label>
                  <Input
                    id="employee-count"
                    type="number"
                    value={formData.employee_count}
                    onChange={(e) => handleInputChange("employee_count", Number.parseInt(e.target.value) || 0)}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="clinic-description">Descripción</Label>
                  <Textarea
                    id="clinic-description"
                    value={formData.clinic_description}
                    onChange={(e) => handleInputChange("clinic_description", e.target.value)}
                    placeholder="Descripción de la clínica..."
                    rows={3}
                  />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="location">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 lg:grid-cols-2"
              >
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle 123 #45-67, Edificio Médico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Bogotá"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado/Departamento *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Cundinamarca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Colombia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Código Postal</Label>
                  <Input
                    id="postal-code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange("postal_code", e.target.value)}
                    placeholder="110111"
                  />
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
