"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, User, LogIn, UserPlus, Activity, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext"
import { getAllEps, getClinicByEpsServices } from "@/services/clinic.service"
import { addToast } from "@heroui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedEps, setSelectedEps] = useState("")
  const { login, isLoading, user, register } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    document_number: "",
    date_of_birth: "",
    address: "",
    eps: "",
    blood_type: "",
    clinic: "",
  })

  
  const [epsOptions, setEpsOptions] = useState<{ value: string; label: string }[]>([])
  const [clinicOptions, setClinicOptions] = useState<{ value: string; label: string }[]>([])

 
  useEffect(() => {
    const fetchEps = async () => {
      try {
        const res = await getAllEps(1, 100)
        const payload = res.data as any
        const epsList = Array.isArray(payload) ? payload : payload?.data ?? []
        const options = epsList.map((eps: { id: string; name: string }) => ({
          value: eps.id,
          label: eps.name,
        }))
        setEpsOptions(options)
      } catch (error) {
        console.error("Error al obtener EPS:", error)
      }
    }
    fetchEps()
  }, [])

  
  useEffect(() => {
    if (!selectedEps) {
      setClinicOptions([])
      return
    }
    const fetchClinics = async () => {
      try {
        const res = await getClinicByEpsServices(selectedEps)
        const clinics = Array.isArray(res.data) ? res.data : []
        const options = clinics.map((item: any) => ({
          value: item.clinic?.id ?? item.clinic_information?.clinic_id ?? item.id,
          label: item.clinic_information?.clinic_name,
        }))
        setClinicOptions(options)
      } catch (error) {
        console.error("Error al obtener clínicas:", error)
      }
    }
    fetchClinics()
  }, [selectedEps])

  const bloodTypes = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ]

  const genderOptions = [
    { value: "male", label: "Hombre" },
    { value: "female", label: "Mujer" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "eps") {
      setSelectedEps(value)
      setFormData((prev) => ({ ...prev, clinic: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone,
        document_number: formData.document_number,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        eps: formData.eps,
        blood_type: formData.blood_type,
        clinic_id: formData.clinic || undefined,
      }

      await register(payload as any)

      addToast({
        title: "Registro exitoso",
        description: "¡Tu cuenta ha sido creada correctamente!",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Registration error:", error)
      addToast({
        title: "Error al registrar",
        description: "Hubo un problema al crear tu cuenta. Inténtalo nuevamente.",
      })
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
      onOpenChange(false);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const { email, password } = formData;
    try {
      await login(email, password);

      addToast({
        title: "Bienvenido",
        description: "Inicio de sesión exitoso",
      });

      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setLoginError('Credenciales incorrectas o error de servidor.');
      addToast({
        title: "Error de inicio de sesión",
        description: "Revisa tus credenciales e inténtalo nuevamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden dark:bg-slate-800 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900" />
          
          {/* Content */}
          <div className="relative p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {mode === "login" 
                  ? "Ingresa a tu cuenta para continuar" 
                  : "Únete a nuestra plataforma de salud"}
              </p>
            </div>

            <Tabs value={mode} onValueChange={(value) => setMode(value as "login" | "register")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-slate-700">
                <TabsTrigger value="login" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="dark:text-slate-400 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-slate-300">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                      required
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="dark:text-slate-300">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData(f => ({ ...f, password: e.target.value }))}
                        required
                        className="pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="dark:text-slate-300">Nombre completo *</Label>
                      <Input
                        id="name"
                        placeholder="Ingrese su nombre completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="document_number" className="dark:text-slate-300">Número de documento *</Label>
                      <Input
                        id="document_number"
                        placeholder="CC.."
                        value={formData.document_number}
                        onChange={(e) => handleInputChange("document_number", e.target.value)}
                        required
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="email" className="dark:text-slate-300">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password" className="dark:text-slate-300">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Crea una contraseña nueva"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                          className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="gender" className="dark:text-slate-300">Género *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Seleccione un género" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="date_of_birth" className="dark:text-slate-300">Fecha de nacimiento *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                        required
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="dark:text-slate-300">Número telefónico *</Label>
                      <Input
                        id="phone"
                        placeholder="+57 320 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="address" className="dark:text-slate-300">Dirección residencial *</Label>
                    <Textarea
                      id="address"
                      placeholder="Ingrese la dirección de su residencia"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="eps" className="dark:text-slate-300">EPS *</Label>
                      <Select value={formData.eps} onValueChange={(value) => handleInputChange("eps", value)}>
                        <SelectTrigger id="eps">
                          <SelectValue placeholder="Seleccione su EPS" />
                        </SelectTrigger>
                        <SelectContent>
                          {epsOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="blood_type" className="dark:text-slate-300">Tipo de sangre</Label>
                      <Select value={formData.blood_type} onValueChange={(value) => handleInputChange("blood_type", value)}>
                        <SelectTrigger id="blood_type">
                          <SelectValue placeholder="Seleccione su tipo de sangre" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="clinic" className="dark:text-slate-300">Clínica *</Label>
                      <Select
                        value={formData.clinic}
                        onValueChange={(value) => handleInputChange("clinic", value)}
                        disabled={!selectedEps}
                      >
                        <SelectTrigger id="clinic" className={!selectedEps ? "opacity-50" : ""}>
                          <SelectValue placeholder={!selectedEps ? "Seleccione EPS primero" : "Seleccione clínica"} />
                        </SelectTrigger>
                        <SelectContent>
                          {clinicOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {!selectedEps && <p className="text-xs text-slate-500 text-center dark:text-slate-400">Por favor seleccione una EPS primero</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center dark:text-slate-400">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ¿Necesitas ayuda?{" "}
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
