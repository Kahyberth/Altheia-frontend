"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/AuthContext"
import { getAllEps, getClinicInformation } from "@/services/clinic.service"
import { createPatientService } from "@/services/auth.service"
import { addToast } from "@heroui/react"

interface PatientAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientAddDialog({ open, onOpenChange }: PatientAddDialogProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 2
  const { user } = useAuth()
  const [clinic, setClinic] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [eps, setEps] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "male",
    phone: "",
    document_number: "",
    date_of_birth: "",
    address: "",
    eps: "",
    blood_type: "",
  })

  const handleInput = (field:string,value:string)=>setFormData(prev=>({...prev,[field]:value}))

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form when dialog is closed
    setTimeout(() => setStep(1), 300)
  }


  useEffect(() => {
    const fetchClinicInformation = async () => {
      if (!user) return;

      const clinicRes = await getClinicInformation(user.id);
      const clinic_id =
        clinicRes.data?.clinic?.id || clinicRes.data?.information?.clinic_id;
      setClinic(clinic_id);
      console.log(clinic_id);

      const epsRes = await getAllEps(1, 100);
      console.log(epsRes);
      const list = Array.isArray(epsRes.data)
        ? epsRes.data
        : epsRes.data?.data ?? [];
      setEps(list);
    };

    fetchClinicInformation();
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] dark:bg-slate-800 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Agregar nuevo paciente</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Ingresa la información del paciente para crear un nuevo registro. Todos los campos marcados con * son requeridos.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4 overflow-hidden">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    step > index + 1
                      ? "bg-blue-600 text-white"
                      : step === index + 1
                        ? "border-2 border-blue-600 text-blue-600"
                        : "border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div className="absolute inset-0 flex items-center">
                <div
                  className="h-1 bg-blue-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium">
              <span className={step >= 1 ? "text-blue-600" : "text-slate-400 dark:text-slate-500"}>Personal Info</span>
              <span className={step >= 2 ? "text-blue-600" : "text-slate-400 dark:text-slate-500"}>Medical Info</span>
            </div>
          </div>

          {/* Form steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-slate-300">Nombre completo *</Label>
                    <Input id="name" placeholder="Enter full name" value={formData.name} onChange={e=>handleInput("name",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="dark:text-slate-300">Fecha de nacimiento *</Label>
                    <Input id="dateOfBirth" type="date" value={formData.date_of_birth} onChange={e=>handleInput("date_of_birth",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">Gender *</Label>
                    <RadioGroup value={formData.gender} onValueChange={val=>handleInput("gender",val)} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer dark:text-slate-300">
                          Mujer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer dark:text-slate-300">
                          Masculino
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document" className="dark:text-slate-300">Número de documento *</Label>
                  <Input id="document" placeholder="Número de documento" value={formData.document_number} onChange={e=>handleInput("document_number",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Esta información será encriptada y almacenada de forma segura.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-slate-300">Correo electrónico *</Label>
                  <Input id="email" placeholder="Correo electrónico" value={formData.email} onChange={e=>handleInput("email",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-slate-300">Número de teléfono *</Label>
                  <Input id="phone" placeholder="Número de teléfono" value={formData.phone} onChange={e=>handleInput("phone",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-slate-300">Password *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e=>handleInput("password",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="address" className="dark:text-slate-300">Street Address *</Label>
                  <Input id="address" value={formData.address} onChange={e=>handleInput("address",e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eps" className="dark:text-slate-300">EPS *</Label>
                  <Select value={formData.eps} onValueChange={val=>handleInput("eps",val)}>
                    <SelectTrigger id="eps" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue placeholder="Select EPS" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      {eps.map(e => (
                        <SelectItem key={e.id} value={e.id} className="dark:text-white dark:focus:bg-slate-700">
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="dark:text-slate-300">Blood Type</Label>
                  <Select value={formData.blood_type} onValueChange={val=>handleInput("blood_type",val)}>
                    <SelectTrigger id="bloodType" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="a+" className="dark:text-white dark:focus:bg-slate-700">A+</SelectItem>
                      <SelectItem value="a-" className="dark:text-white dark:focus:bg-slate-700">A-</SelectItem>
                      <SelectItem value="b+" className="dark:text-white dark:focus:bg-slate-700">B+</SelectItem>
                      <SelectItem value="b-" className="dark:text-white dark:focus:bg-slate-700">B-</SelectItem>
                      <SelectItem value="ab+" className="dark:text-white dark:focus:bg-slate-700">AB+</SelectItem>
                      <SelectItem value="ab-" className="dark:text-white dark:focus:bg-slate-700">AB-</SelectItem>
                      <SelectItem value="o+" className="dark:text-white dark:focus:bg-slate-700">O+</SelectItem>
                      <SelectItem value="o-" className="dark:text-white dark:focus:bg-slate-700">O-</SelectItem>
                      <SelectItem value="unknown" className="dark:text-white dark:focus:bg-slate-700">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex items-center justify-between dark:border-slate-700">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep} className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {step < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={async()=>{
              if(!user){
                addToast({title:"Usuario no autenticado",description:"Debes iniciar sesión para crear un paciente"});
                return;
              }
              try{
                const clinicRes=await getClinicInformation(user.id);
                const clinic_id=clinicRes.data?.clinic?.id||clinicRes.data?.information?.clinic_id;
                await createPatientService({
                  name:            formData.name,
                  email:           formData.email,
                  password:        formData.password,
                  gender:          formData.gender,
                  phone:           formData.phone,
                  document_number: formData.document_number,
                  date_of_birth:   formData.date_of_birth,
                  address:         formData.address,
                  eps:             formData.eps,
                  blood_type:      formData.blood_type,
                  clinic_id:       clinic_id
                });
                addToast({title:"Paciente creado",description:"El paciente se registró correctamente"});
                onOpenChange(false);
              }catch(err){
                console.error(err);
                addToast({title:"Error",description:"No se pudo crear el paciente"});
              }
            }}>Create Patient</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
