"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, ChevronLeft, ChevronRight, User, Building2, MapPin, Settings, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { registerClinic, getAllServices, getAllEps } from "@/services/clinic.service"
import { Services, EPS, ClinicRegistrationData } from "@/types/clinic"

const steps = [
  {
    id: 1,
    title: "Información del Propietario",
    description: "Datos personales del responsable",
    icon: User,
  },
  {
    id: 2,
    title: "Información de la Organización",
    description: "Detalles del centro médico",
    icon: Building2,
  },
  {
    id: 3,
    title: "Ubicación y Contacto",
    description: "Dirección y datos de contacto",
    icon: MapPin,
  },
  {
    id: 4,
    title: "Servicios y Configuración",
    description: "Servicios ofrecidos y configuración",
    icon: Settings,
  },
]

export default function CreateClinicPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false)

  // Available options from API
  const [availableServices, setAvailableServices] = useState<Services[]>([])
  const [availableEps, setAvailableEps] = useState<EPS[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Form data
  const [formData, setFormData] = useState<ClinicRegistrationData>({
    // Owner data
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    owner_position: "",
    owner_document_number: "",
    owner_gender: "",
    
    // Clinic data
    name: "",
    email: "",
    description: "",
    phone: "",
    website: "",
    
    // Location data
    address: "",
    country: "Colombia",
    city: "",
    state: "",
    postal_code: "",
    
    // Configuration
    member_count: 1,
    services_offered: [],
    accepted_eps: [],
  })

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    const authUser = localStorage.getItem("authUser")
    if (authUser && authUser !== "null") {
      setIsAuthenticatedUser(true)
      router.push("/dashboard")
    }
  }, [router])

  // Load available services and EPS on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [servicesRes, epsRes] = await Promise.all([
          getAllServices(1, 100), // Load enough items for selection
          getAllEps(1, 100)
        ])
        
        setAvailableServices(servicesRes.data?.data || servicesRes.data || [])
        setAvailableEps(epsRes.data?.data || epsRes.data || [])
      } catch (error) {
        console.error('Error loading options:', error)
        setError('Error cargando opciones disponibles')
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
  }, [])

  const handleInputChange = (field: keyof ClinicRegistrationData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.owner_name && formData.owner_email && formData.owner_phone && 
                 formData.owner_position && formData.owner_document_number && formData.owner_gender)
      case 2:
        return !!(formData.name && formData.email && formData.description && 
                 formData.phone && formData.website)
      case 3:
        return !!(formData.address && formData.city && formData.state && formData.postal_code)
      case 4:
        return formData.services_offered.length > 0 && formData.accepted_eps.length > 0
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setError('Por favor completa todos los campos requeridos')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId - 1)) {
      setCurrentStep(stepId)
      setError(null)
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = formData.services_offered
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId]
    
    handleInputChange('services_offered', newServices)
  }

  const handleEpsToggle = (epsId: string) => {
    const currentEps = formData.accepted_eps
    const newEps = currentEps.includes(epsId)
      ? currentEps.filter(id => id !== epsId)
      : [...currentEps, epsId]
    
    handleInputChange('accepted_eps', newEps)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await registerClinic(formData)
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error: any) {
      console.error('Error registering clinic:', error)
      setError(error.response?.data?.message || 'Error al registrar la clínica. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepData = steps.find((step) => step.id === currentStep)

  if (isAuthenticatedUser) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Redirigiendo al dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loadingOptions) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando opciones disponibles...</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Clínica registrada exitosamente!</h2>
            <p className="text-gray-600 mb-4">Tu clínica ha sido creada correctamente.</p>
            <p className="text-sm text-gray-500">Serás redirigido al inicio de sesión en unos segundos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Registrar Nueva Clínica</h1>
        <p className="text-gray-600">Completa la información para crear tu centro médico</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stepper Header */}
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -translate-y-1/2" />

        {/* Progress Line Active */}
        <div
          className="absolute top-6 left-6 h-0.5 bg-blue-500 -translate-y-1/2 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 3rem)",
          }}
        />

        <div className="relative flex items-start justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === step.id
            const isClickable = step.id <= currentStep || isCompleted

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && handleStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white border-2 relative z-10",
                    isCompleted
                      ? "border-green-500 bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                      : isCurrent
                        ? "border-blue-500 bg-blue-500 text-white focus:ring-blue-500"
                        : isClickable
                          ? "border-gray-300 text-gray-600 hover:border-gray-400 focus:ring-gray-500"
                          : "border-gray-200 text-gray-400 cursor-not-allowed",
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </button>

                <div className="mt-4 text-center max-w-32">
                  <p className={cn(
                    "text-sm font-medium leading-tight",
                    isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500",
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 hidden sm:block leading-tight">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStepData?.icon && <currentStepData.icon className="w-5 h-5" />}
            {currentStepData?.title}
          </CardTitle>
          <CardDescription>{currentStepData?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Owner Information */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner_name">Nombre Completo *</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => handleInputChange('owner_name', e.target.value)}
                  placeholder="Carlos Rodríguez"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_email">Email *</Label>
                <Input
                  id="owner_email"
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => handleInputChange('owner_email', e.target.value)}
                  placeholder="carlos.rodriguez@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_phone">Teléfono *</Label>
                <Input
                  id="owner_phone"
                  value={formData.owner_phone}
                  onChange={(e) => handleInputChange('owner_phone', e.target.value)}
                  placeholder="+57 3209876543"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_position">Cargo *</Label>
                <Input
                  id="owner_position"
                  value={formData.owner_position}
                  onChange={(e) => handleInputChange('owner_position', e.target.value)}
                  placeholder="Director Médico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_document_number">Documento *</Label>
                <Input
                  id="owner_document_number"
                  value={formData.owner_document_number}
                  onChange={(e) => handleInputChange('owner_document_number', e.target.value)}
                  placeholder="987654321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_gender">Género *</Label>
                <Select value={formData.owner_gender} onValueChange={(value) => handleInputChange('owner_gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Clinic Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Centro *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Centro Médico Bienestar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Institucional *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="info@bienestar.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+57 604567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web *</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.bienestar.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Institución especializada en atención médica integral y promoción de la salud."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Carrera 45 #67-89"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Colombia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Medellín"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Departamento *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Antioquia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Código Postal *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="050021"
                />
              </div>
            </div>
          )}

          {/* Step 4: Services and Configuration */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="member_count">Número de Miembros</Label>
                <Input
                  id="member_count"
                  type="number"
                  min="1"
                  value={formData.member_count}
                  onChange={(e) => handleInputChange('member_count', parseInt(e.target.value) || 1)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Servicios Ofrecidos *</h4>
                <p className="text-sm text-gray-500">Selecciona los servicios que ofrece tu clínica</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {availableServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={formData.services_offered.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <Label htmlFor={`service-${service.id}`} className="text-sm">
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.services_offered.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.services_offered.map((serviceId) => {
                      const service = availableServices.find(s => s.id === serviceId)
                      return service ? (
                        <Badge key={serviceId} variant="secondary" className="bg-blue-100 text-blue-800">
                          {service.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">EPS Aceptadas *</h4>
                <p className="text-sm text-gray-500">Selecciona las EPS que acepta tu clínica</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {availableEps.map((eps) => (
                    <div key={eps.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`eps-${eps.id}`}
                        checked={formData.accepted_eps.includes(eps.id)}
                        onCheckedChange={() => handleEpsToggle(eps.id)}
                      />
                      <Label htmlFor={`eps-${eps.id}`} className="text-sm">
                        {eps.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.accepted_eps.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.accepted_eps.map((epsId) => {
                      const eps = availableEps.find(e => e.id === epsId)
                      return eps ? (
                        <Badge key={epsId} variant="outline" className="border-green-200 text-green-800">
                          {eps.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Paso {currentStep} de {steps.length}
          </span>
        </div>

        {currentStep === steps.length ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !validateStep(currentStep)}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                Registrar Clínica
                <Check className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            disabled={!validateStep(currentStep)}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Progress: Step ${currentStep} of ${steps.length}`}
        />
      </div>
    </div>
  )
}
