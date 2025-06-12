"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Shield, Check } from "lucide-react"

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

interface AddEpsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddEps: (eps: string[]) => void
  existingEps: string[]
}

const commonEPS = [
  "Sura EPS",
  "Nueva EPS",
  "Sanitas EPS",
  "Compensar EPS",
  "Famisanar EPS",
  "Salud Total EPS",
  "Coomeva EPS",
  "Medimás EPS",
  "Aliansalud EPS",
  "Coosalud EPS",
  "Mutual SER",
  "Capital Salud EPS",
  "EPS SURA",
  "Cajacopi EPS",
  "Comfenalco Valle EPS",
]

export function AddEpsDialog({ open, onOpenChange, onAddEps, existingEps }: AddEpsDialogProps) {
  const [newEps, setNewEps] = useState("")
  const [selectedEps, setSelectedEps] = useState<string[]>([])

  const availableEps = commonEPS.filter((eps) => !existingEps.includes(eps))

  const handleAddCustomEps = () => {
    if (newEps.trim() && !selectedEps.includes(newEps.trim()) && !existingEps.includes(newEps.trim())) {
      setSelectedEps([...selectedEps, newEps.trim()])
      setNewEps("")
    }
  }

  const handleToggleEps = (eps: string) => {
    setSelectedEps((prev) => (prev.includes(eps) ? prev.filter((e) => e !== eps) : [...prev, eps]))
  }

  const handleRemoveSelected = (eps: string) => {
    setSelectedEps((prev) => prev.filter((e) => e !== eps))
  }

  const handleSubmit = () => {
    if (selectedEps.length > 0) {
      onAddEps(selectedEps)
      setSelectedEps([])
      setNewEps("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedEps([])
    setNewEps("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Añadir EPS
          </DialogTitle>
          <DialogDescription>Selecciona las EPS que acepta tu clínica o añade una personalizada</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Custom EPS Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-eps">EPS Personalizada</Label>
            <div className="flex gap-2">
              <Input
                id="custom-eps"
                placeholder="Nombre de la EPS..."
                value={newEps}
                onChange={(e) => setNewEps(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomEps()}
              />
              <Button onClick={handleAddCustomEps} disabled={!newEps.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Available EPS */}
          {availableEps.length > 0 && (
            <div className="space-y-3">
              <Label>EPS Disponibles</Label>
              <div className="grid gap-2 max-h-48 overflow-auto">
                {availableEps.map((eps) => (
                  <motion.div
                    key={eps}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedEps.includes(eps) ? "bg-green-50 border-green-200" : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleToggleEps(eps)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-50 p-1.5">
                        <Shield className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">{eps}</span>
                    </div>
                    {selectedEps.includes(eps) && <Check className="h-4 w-4 text-green-600" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Selected EPS */}
          {selectedEps.length > 0 && (
            <div className="space-y-3">
              <Label>EPS Seleccionadas ({selectedEps.length})</Label>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedEps.map((eps) => (
                    <motion.div
                      key={eps}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="gap-1">
                        {eps}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleRemoveSelected(eps)}
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
          <Button onClick={handleSubmit} disabled={selectedEps.length === 0}>
            Añadir {selectedEps.length > 0 && `(${selectedEps.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
