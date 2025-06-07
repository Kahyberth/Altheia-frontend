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
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
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
    // Reset state when dialog is closed
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

  const handleDeleteAccount = () => {
    setIsDeleting(true)
    // Simulate account deletion process
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleted(true)
    }, 2000)
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
                Delete Account
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please read the information below carefully.
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
                        <p className="font-medium text-amber-800">Important Information</p>
                        <ul className="space-y-1 text-sm text-amber-700">
                          <li>• All your personal data will be permanently deleted</li>
                          <li>• You will lose access to all your medical records in the system</li>
                          <li>• Any scheduled appointments will be canceled</li>
                          <li>• This action cannot be reversed</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">Before proceeding, please consider these alternatives:</p>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium">Temporarily Deactivate Your Account</p>
                      <p className="text-sm text-slate-500">
                        You can reactivate your account at any time by signing in again.
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium">Update Your Notification Settings</p>
                      <p className="text-sm text-slate-500">
                        You can customize how and when you receive notifications.
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium">Contact Support</p>
                      <p className="text-sm text-slate-500">
                        Our support team can help resolve any issues you're experiencing.
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
                    Please confirm that you understand the consequences of deleting your account by checking all boxes
                    below:
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
                          I understand that all my data will be permanently deleted
                        </Label>
                        <p className="text-xs text-slate-500">
                          Including personal information, medical records, and appointment history
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
                          I understand that this action cannot be undone
                        </Label>
                        <p className="text-xs text-slate-500">Once deleted, your account cannot be recovered</p>
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
                          I understand that I will lose access to the MediSync EHR system
                        </Label>
                        <p className="text-xs text-slate-500">Including all features, services, and support</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      <strong>Note on Data Retention:</strong> Some information may be retained for legal and compliance
                      purposes in accordance with healthcare regulations. For more information, please refer to our
                      Privacy Policy.
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
                        <p className="font-medium text-red-800">Final Warning</p>
                        <p className="text-sm text-red-700">
                          You are about to permanently delete your account. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-text" className="text-sm font-medium">
                      To confirm, please type "delete my account" below:
                    </Label>
                    <Input
                      id="confirm-text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className={confirmText && !confirmTextMatches ? "border-red-300 focus-visible:ring-red-400" : ""}
                    />
                    {confirmText && !confirmTextMatches && (
                      <p className="text-xs text-red-500">Text does not match "delete my account"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between gap-2">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
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
                  {step === 1 ? "I Want To Delete My Account" : "Continue"}
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
                      Deleting Account...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Permanently Delete Account
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
            <h2 className="mb-2 text-xl font-semibold">Account Deleted</h2>
            <p className="mb-6 text-slate-500">
              Your account has been successfully deleted. All your personal data has been removed from our systems.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
