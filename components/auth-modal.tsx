"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, User, LogIn, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedEps, setSelectedEps] = useState("")
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

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

  const epsOptions = [
    { value: "salud_total", label: "Salud Total" },
    { value: "eps_sura", label: "EPS Sura" },
    { value: "nueva_eps", label: "Nueva EPS" },
    { value: "sanitas", label: "Sanitas" },
    { value: "compensar", label: "Compensar" },
    { value: "famisanar", label: "Famisanar" },
    { value: "coomeva", label: "Coomeva" },
  ]

  const clinicOptions = {
    salud_total: [
      { value: "U7l9sq5o2gpt5opvYw7es", label: "Clínica Salud Total Norte" },
      { value: "A8m2tr6p3hqu6pqwZx8ft", label: "Clínica Salud Total Sur" },
      { value: "B9n3us7q4irv7qrxAy9gu", label: "Clínica Salud Total Centro" },
    ],
    eps_sura: [
      { value: "C0o4vt8r5jsw8rsyBz0hv", label: "Clínica Sura Chapinero" },
      { value: "D1p5wu9s6ktx9stzC10iw", label: "Clínica Sura Zona Rosa" },
    ],
    nueva_eps: [
      { value: "E2q6xv0t7luy0tuaD21jx", label: "Clínica Nueva EPS Principal" },
      { value: "F3r7yw1u8mvz1uvbE32ky", label: "Clínica Nueva EPS Suba" },
    ],
    sanitas: [
      { value: "G4s8zx2v9nwa2vwcF43lz", label: "Clínica Sanitas La Colina" },
      { value: "H5t9ay3w0oxb3wxdG54ma", label: "Clínica Sanitas Virrey" },
    ],
    compensar: [
      { value: "I6u0bz4x1pyc4xyeH65nb", label: "Clínica Compensar Kennedy" },
      { value: "J7v1ca5y2qzd5yzfI76oc", label: "Clínica Compensar Soacha" },
    ],
    famisanar: [
      { value: "K8w2db6z3rae6zagJ87pd", label: "Clínica Famisanar Bosa" },
      { value: "L9x3ec7a4sbf7abhK98qe", label: "Clínica Famisanar Engativá" },
    ],
    coomeva: [
      { value: "M0y4fd8b5tcg8bciL09rf", label: "Clínica Coomeva Medellín" },
      { value: "N1z5ge9c6udh9cdjM10sg", label: "Clínica Coomeva Cali" },
    ],
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration data:", formData)
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
      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setLoginError('Credenciales incorrectas o error de servidor.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Bienvenido a Altheia
          </DialogTitle>
          <DialogDescription>Inicia sesión o crea una nueva cuenta</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="Enter your email" required value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}

              <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
                {isRedirecting ? 'Redirigiendo...' : isLoading ? 'Cargando...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm text-slate-600">
                  Olvidaste tú contraseña?
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    placeholder="Ingrese su nombre completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_number">Número de documento *</Label>
                  <Input
                    id="document_number"
                    placeholder="CC.."
                    value={formData.document_number}
                    onChange={(e) => handleInputChange("document_number", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Dirección de correo eléctronico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo eléctronico"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña nueva"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Genero *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Seleccione un genero" />
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
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Fecha de nacimiento *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Número teléfonico *</Label>
                <Input
                  id="phone"
                  placeholder="+57 320 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección residencial *</Label>
                <Textarea
                  id="address"
                  placeholder="Ingres la dirección de su residencia"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eps">EPS *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="blood_type">Tipo de sangre</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic">Clínica *</Label>
                <Select
                  value={formData.clinic}
                  onValueChange={(value) => handleInputChange("clinic", value)}
                  disabled={!selectedEps}
                >
                  <SelectTrigger id="clinic" className={!selectedEps ? "opacity-50" : ""}>
                    <SelectValue placeholder={!selectedEps ? "Seleccione una EPS primero" : "Seleccione una clínica"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEps &&
                      clinicOptions[selectedEps as keyof typeof clinicOptions]?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {!selectedEps && <p className="text-xs text-slate-500">Por favor seleccione una eps primero</p>}
              </div>

              <Button type="submit" className="w-full">
                Registrarse
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
