"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAuth } from "@/context/AuthContext"
import { loginActivityService } from "@/services/auth.service"

const COLORS = ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc"]

interface LoginActivity {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  login_time: string;
  device_type?: string;
  location?: string;
  is_current_session?: boolean;
}

export function AnalyticsOverview() {
  const { user } = useAuth()
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLoginActivities = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await loginActivityService(user.id)
        const activities = response.data?.activities || []
        setLoginActivities(activities)
      } catch (error) {
        console.error('Error fetching login activities:', error)
        setError('No se pudieron cargar los datos de actividad')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoginActivities()
  }, [user?.id])

  
  const processWeeklyUsage = () => {
    if (!loginActivities.length) {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
          value: 0
        }
      })
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toDateString(),
        name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        value: 0
      }
    })

    loginActivities.forEach(activity => {
      const activityDate = new Date(activity.login_time).toDateString()
      const dayIndex = last7Days.findIndex(day => day.date === activityDate)
      if (dayIndex !== -1) {
        last7Days[dayIndex].value++
      }
    })

    return last7Days.map(({ name, value }) => ({ name, value }))
  }

  const processResourceUsage = () => {
    if (!loginActivities.length) {
      return [
        { name: "Acceso al Sistema", value: 100 },
        { name: "Citas", value: 0 },
        { name: "Laboratorio", value: 0 },
        { name: "Perfil", value: 0 },
      ]
    }


    const totalLogins = loginActivities.length
    const uniqueDays = new Set(
      loginActivities.map(activity => 
        new Date(activity.login_time).toDateString()
      )
    ).size

    
    const systemAccess = Math.round((totalLogins / Math.max(totalLogins, 1)) * 100)
    const appointments = Math.round((uniqueDays / 7) * 30) 
    const laboratory = Math.round(Math.random() * 20) 
    const profile = Math.round((100 - systemAccess - appointments - laboratory) / 2)

    return [
      { name: "Acceso al Sistema", value: Math.max(systemAccess, 40) },
      { name: "Citas", value: Math.max(appointments, 25) },
      { name: "Laboratorio", value: Math.max(laboratory, 15) },
      { name: "Perfil", value: Math.max(profile, 15) },
    ]
  }

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded mb-2"></div>
          <div className="h-[180px] bg-slate-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded mb-2"></div>
          <div className="h-[180px] bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Mostrando datos de ejemplo
          </p>
        </div>
        {/* Fallback a datos estáticos en caso de error */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Actividad del Sistema (Últimos 7 Días)</h4>
          <motion.div initial="hidden" animate="visible" variants={chartVariants} className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: "Lun", value: 0 },
                { name: "Mar", value: 0 },
                { name: "Mié", value: 0 },
                { name: "Jue", value: 0 },
                { name: "Vie", value: 0 },
                { name: "Sáb", value: 0 },
                { name: "Dom", value: 1 },
              ]} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    border: "none",
                  }}
                  cursor={{ stroke: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    )
  }

  const weeklyUsageData = processWeeklyUsage()
  const resourceUsageData = processResourceUsage()

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">Tu Actividad (Últimos 7 Días)</h4>
        <motion.div initial="hidden" animate="visible" variants={chartVariants} className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyUsageData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  border: "none",
                }}
                cursor={{ stroke: "#e2e8f0" }}
                formatter={(value: any) => [`${value} accesos`, "Actividad"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="border-t pt-4 dark:border-slate-600">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {loginActivities.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Accesos
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {new Set(loginActivities.map(a => new Date(a.login_time).toDateString())).size}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Días Activos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
