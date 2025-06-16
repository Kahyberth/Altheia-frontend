"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, TrendingUp, Activity, BarChart3, Loader2 } from "lucide-react"

interface ChartData {
  name: string
  value: number
}

interface PatientStats {
  type: string
  data: {
    age_distribution: ChartData[]
    gender_distribution: ChartData[]
    total_patients: number
    timestamp: string
  }
}

interface AppointmentStats {
  type: string
  data: {
    appointments_by_status: ChartData[]
    appointments_by_month: ChartData[]
    total_appointments: number
    today_appointments: number
    timestamp: string
  }
}

interface ConsultationStats {
  type: string
  data: {
    consultations_created: ChartData[]
    total_consultations: number
    weekly_consultations: number
    timestamp: string
  }
}

export function PatientChart({ clinicId }: { clinicId?: string }) {
  const [chartType, setChartType] = useState("bar")
  const [selectedMetric, setSelectedMetric] = useState("age")
  const [currentData, setCurrentData] = useState<ChartData[]>([])
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [todayAppointments, setTodayAppointments] = useState(0)
  const [totalConsultations, setTotalConsultations] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [isLoading, setIsLoading] = useState(true)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false)
  
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxReconnectAttempts = 5
  const reconnectDelay = [1000, 2000, 3000, 5000, 10000] // Escalating delays
  const isProduction = process.env.NODE_ENV === 'production'

  // Estados para almacenar todos los datos
  const [patientStats, setPatientStats] = useState<PatientStats | null>(null)
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStats | null>(null)
  const [consultationStats, setConsultationStats] = useState<ConsultationStats | null>(null)

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  // Función para conectar al WebSocket
  const connectWebSocket = () => {
    // Si ya está conectado, no hacer nada
    if (ws.current?.readyState === WebSocket.OPEN) {
      return
    }

    // Si ya llegamos al máximo de intentos, no intentar más
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log('Máximo de intentos de reconexión alcanzado')
      setConnectionStatus("Connection failed")
      setIsLoading(false)
      return
    }

    const wsUrl = `ws://localhost:8080/ws/stats${clinicId ? `?clinic_id=${clinicId}` : ''}`
    
    // Actualizar estado antes de intentar conectar
    if (reconnectAttempts > 0) {
      setConnectionStatus(`Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`)
    } else {
      setConnectionStatus("Connecting...")
    }
    
    try {
      // Cerrar conexión anterior si existe
      if (ws.current) {
        ws.current.close()
      }
      
      console.log(`Intentando conectar a WebSocket: ${wsUrl} (intento ${reconnectAttempts + 1})`)
      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        console.log('✅ Conectado al WebSocket exitosamente')
        setIsConnected(true)
        setConnectionStatus("Connected")
        setReconnectAttempts(0) // Reset counter on successful connection
        setHasConnectedOnce(true) // Mark that we've connected at least once
        
        // Limpiar timeout de reconexión si existe
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log('📨 Mensaje recibido:', message.type, message.data)

          switch (message.type) {
            case 'patient_stats':
              setPatientStats(message)
              setTotalPatients(message.data.total_patients)
              break
            case 'appointment_stats':
              setAppointmentStats(message)
              setTotalAppointments(message.data.total_appointments)
              setTodayAppointments(message.data.today_appointments)
              break
            case 'consultation_stats':
              setConsultationStats(message)
              setTotalConsultations(message.data.total_consultations)
              break
            case 'connection':
              console.log('🔗 Mensaje de conexión:', message.data)
              break
            default:
              console.log('❓ Tipo de mensaje desconocido:', message.type)
          }
          
          // Marcar como no loading una vez que recibimos el primer mensaje de datos
          if (message.type !== 'connection') {
            setIsLoading(false)
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
        }
      }

      ws.current.onclose = (event) => {
        console.log(`🔌 WebSocket cerrado. Código: ${event.code}, Razón: ${event.reason}`)
        setIsConnected(false)
        setIsLoading(true)
        
        // Solo intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000) {
          scheduleReconnect()
        }
      }

      ws.current.onerror = (error) => {
        // En desarrollo y si nunca nos hemos conectado, los errores iniciales son esperados
        const isInitialConnectionAttempt = !hasConnectedOnce && reconnectAttempts === 0
        
        if (reconnectAttempts >= maxReconnectAttempts - 1) {
          // Solo mostrar como error crítico si hemos agotado todos los intentos
          console.error('❌ Error crítico en WebSocket (sin más intentos):', {
            readyState: ws.current?.readyState,
            url: wsUrl,
            attempts: reconnectAttempts + 1,
            maxAttempts: maxReconnectAttempts
          })
        } else if (isInitialConnectionAttempt && !isProduction) {
          // Para el primer intento en desarrollo, usar un mensaje más suave
          console.info(`ℹ️  Initial WebSocket connection attempt failed (backend not ready) - will retry automatically`)
        } else if (!isProduction) {
          // Durante los intentos subsecuentes en desarrollo
          console.warn(`⚠️ WebSocket connection failed (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts}) - will retry:`, {
            readyState: ws.current?.readyState,
            url: wsUrl
          })
        } else {
          // En producción, solo loggear errores críticos
          if (reconnectAttempts > 2) {
            console.error('WebSocket connection issues detected', {
              attempts: reconnectAttempts + 1,
              maxAttempts: maxReconnectAttempts
            })
          }
        }
        
        // No cambiar isLoading aquí, dejar que onclose maneje la reconexión
        setConnectionStatus("Connection error")
      }

    } catch (error) {
      console.error('❌ Error creando WebSocket:', error)
      scheduleReconnect()
    }
  }

  // Función para programar reconexión
  const scheduleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setConnectionStatus("Connection failed")
      setIsLoading(false)
      return
    }

    const delay = reconnectDelay[Math.min(reconnectAttempts, reconnectDelay.length - 1)]
    console.log(`⏰ Programando reconexión en ${delay}ms (intento ${reconnectAttempts + 1}/${maxReconnectAttempts})`)
    
    setConnectionStatus(`Reconnecting in ${delay/1000}s...`)
    
    // Limpiar timeout anterior si existe
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1)
      connectWebSocket()
    }, delay)
  }

  // Efecto para conectar al WebSocket al montar el componente
  useEffect(() => {
    // Reset reconnect attempts when clinicId changes
    setReconnectAttempts(0)
    setHasConnectedOnce(false)
    setIsLoading(true)
    connectWebSocket()

    // Cleanup al desmontar
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting') // Cierre intencional
        ws.current = null
      }
    }
  }, [clinicId])

  // Efecto para actualizar datos según la métrica seleccionada
  useEffect(() => {
    switch (selectedMetric) {
      case 'age':
        if (patientStats?.data.age_distribution) {
          setCurrentData(patientStats.data.age_distribution)
        }
        break
      case 'gender':
        if (patientStats?.data.gender_distribution) {
          setCurrentData(patientStats.data.gender_distribution)
        }
        break
      case 'visits':
        if (consultationStats?.data.consultations_created) {
          setCurrentData(consultationStats.data.consultations_created)
        }
        break
      case 'appointments':
        if (appointmentStats?.data.appointments_by_status) {
          setCurrentData(appointmentStats.data.appointments_by_status)
        }
        break
    }
  }, [selectedMetric, patientStats, appointmentStats, consultationStats])

  const LoaderComponent = () => (
    <div className="flex flex-col items-center justify-center h-80 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Cargando estadísticas...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {connectionStatus}
        </p>
      </div>
    </div>
  )

  const getCurrentData = () => {
    return currentData || []
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 text-sm ${
          isConnected 
            ? 'text-green-600 dark:text-green-400' 
            : reconnectAttempts > 0 
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected 
              ? 'bg-green-500 animate-pulse' 
              : reconnectAttempts > 0 
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500'
          }`} />
          <span className="font-medium">
            {isConnected ? '🟢' : reconnectAttempts > 0 ? '🟡' : '🔴'} Real-time: {connectionStatus}
          </span>
          {reconnectAttempts > 0 && (
            <span className="text-xs opacity-75">
              ({reconnectAttempts}/{maxReconnectAttempts} attempts)
            </span>
          )}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("bar")}
            className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            disabled={isLoading}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Barras
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("pie")}
            className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            disabled={isLoading}
          >
            <Activity className="h-4 w-4 mr-1" />
            Circular
          </Button>
        </div>
        <Select value={selectedMetric} onValueChange={setSelectedMetric} disabled={isLoading}>
          <SelectTrigger className="w-48 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
            <SelectItem value="age" className="dark:text-white dark:focus:bg-slate-700">
              Distribución por Edad
            </SelectItem>
            <SelectItem value="gender" className="dark:text-white dark:focus:bg-slate-700">
              Distribución por Género
            </SelectItem>
            <SelectItem value="visits" className="dark:text-white dark:focus:bg-slate-700">
              Consultas Creadas
            </SelectItem>
            <SelectItem value="appointments" className="dark:text-white dark:focus:bg-slate-700">
              Estados de Citas
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart Container */}
      <motion.div 
        className="h-80 w-full p-4 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        key={selectedMetric + chartType}
      >
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={getCurrentData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCurrentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border dark:border-slate-700">
          <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              totalPatients
            )}
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400">Total Pacientes</p>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border dark:border-slate-700">
          <Activity className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900 dark:text-green-300">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              totalAppointments
            )}
          </div>
          <p className="text-sm text-green-700 dark:text-green-400">Total Citas</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border dark:border-slate-700">
          <TrendingUp className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              todayAppointments
            )}
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">Citas Hoy</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border dark:border-slate-700">
          <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              totalConsultations
            )}
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-400">Total Consultas</p>
        </div>
      </div>
    </div>
  )
}