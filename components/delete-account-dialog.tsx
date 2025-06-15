"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Check, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: () => Promise<void>
}

export function DeleteAccountDialog({ open, onOpenChange, onDelete }: DeleteAccountDialogProps) {
  const [step, setStep] = useState(1)
  const [confirmText, setConfirmText] = useState("")
  const [confirmCheckboxes, setConfirmCheckboxes] = useState({
    data: false,
    irreversible: false,
    understand: false,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep(1)
      setConfirmText("")
      setConfirmCheckboxes({
        data: false,
        irreversible: false,
        understand: false,
      })
      setIsDeleting(false)
      setIsDeleted(false)
    }, 300)
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleDeleteAccount = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true)
    try {
      await onDelete();
      setIsDeleted(true)
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeleting(false)
    }
  }

  const allCheckboxesChecked = Object.values(confirmCheckboxes).every(Boolean)
  const confirmTextMatches = confirmText.toLowerCase() === "delete my account"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!isDeleted ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Eliminar cuenta
              </DialogTitle>
              <DialogDescription>
                Esta acción no puede ser deshecha. Por favor, lee la información abajo cuidadosamente.
              </DialogDescription>
            </DialogHeader>

            <div className="relative mt-4 overflow-hidden">
              {/* Progress indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                        step > index + 1
                          ? "bg-red-600 text-white"
                          : step === index + 1
                            ? "border-2 border-red-600 text-red-600"
                            : "border border-slate-200 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-1 w-full bg-slate-200"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="h-1 bg-red-600 transition-all duration-300"
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Step 1: Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                      <div className="space-y-2">
                        <p className="font-medium text-amber-800">Información importante</p>
                        <ul className="space-y-1 text-sm text-amber-700">
                          <li>• Todas tus datos personales serán eliminados permanentemente</li>
                          <li>• Perderás acceso a todos tus registros médicos en el sistema</li>
                          <li>• Cualquier cita programada será cancelada</li>
                          <li>• Esta acción no puede ser deshecha</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">Antes de proceder, por favor considera estas alternativas:</p>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium">Desactivar tu cuenta temporalmente</p>
                      <p className="text-sm text-slate-500">
                        Puedes reactivar tu cuenta en cualquier momento ingresando nuevamente.
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium">Actualizar tus ajustes de notificación</p>
                      <p className="text-sm text-slate-500">
                        Puedes personalizar cómo y cuando recibes notificaciones.
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium">Contactar soporte</p>
                      <p className="text-sm text-slate-500">
                        Nuestro equipo de soporte puede ayudar a resolver cualquier problema que estés experimentando.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Confirmation Checkboxes */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-600">
                    Por favor, confirma que entiendes los consecuencias de eliminar tu cuenta marcando todas las casillas
                    abajo:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="confirm-data"
                        checked={confirmCheckboxes.data}
                        onCheckedChange={(checked) =>
                          setConfirmCheckboxes({ ...confirmCheckboxes, data: checked as boolean })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="confirm-data"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Entiendo que todos mis datos serán eliminados permanentemente
                        </Label>
                        <p className="text-xs text-slate-500">
                          Incluyendo información personal, registros médicos y historial de citas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="confirm-irreversible"
                        checked={confirmCheckboxes.irreversible}
                        onCheckedChange={(checked) =>
                          setConfirmCheckboxes({ ...confirmCheckboxes, irreversible: checked as boolean })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="confirm-irreversible"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Entiendo que esta acción no puede ser deshecha
                        </Label>
                        <p className="text-xs text-slate-500">Una vez eliminada, tu cuenta no puede ser recuperada</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="confirm-understand"
                        checked={confirmCheckboxes.understand}
                        onCheckedChange={(checked) =>
                          setConfirmCheckboxes({ ...confirmCheckboxes, understand: checked as boolean })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="confirm-understand"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Entiendo que perderé acceso al sistema MediSync EHR
                        </Label>
                        <p className="text-xs text-slate-500">Incluyendo todas las características, servicios y soporte</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      <strong>Nota sobre la retención de datos:</strong> Alguna información puede ser retenida para
                      fines legales y de cumplimiento en conformidad con las regulaciones de salud. Para más información,
                      por favor, consulta nuestra Política de Privacidad.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Final Confirmation */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">Advertencia final</p>
                        <p className="text-sm text-red-700">
                          Estás a punto de eliminar tu cuenta permanentemente. Esta acción no puede ser deshecha.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-text" className="text-sm font-medium">
                      Para confirmar, por favor, escribe "eliminar mi cuenta" abajo:
                    </Label>
                    <Input
                      id="confirm-text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className={confirmText && !confirmTextMatches ? "border-red-300 focus-visible:ring-red-400" : ""}
                    />
                    {confirmText && !confirmTextMatches && (
                      <p className="text-xs text-red-500">El texto no coincide con "eliminar mi cuenta"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between gap-2">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Volver
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  variant={step === 1 ? "outline" : "default"}
                  className={step === 1 ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" : ""}
                  onClick={handleNextStep}
                  disabled={step === 2 && !allCheckboxesChecked}
                >
                  {step === 1 ? "Quiero eliminar mi cuenta" : "Continuar"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={!confirmTextMatches || isDeleting}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Eliminando cuenta...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Eliminar cuenta permanentemente
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Cuenta eliminada</h2>
            <p className="mb-6 text-slate-500">
              Tu cuenta ha sido eliminada exitosamente. Todos tus datos personales han sido eliminados de nuestros sistemas.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
