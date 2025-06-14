"use client"

import { useState } from "react"
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
import { Users, TrendingUp, Activity, BarChart3 } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Age distribution data
const ageData = [
  { name: "0-17", value: 124, fill: "#38bdf8" },
  { name: "18-34", value: 285, fill: "#0ea5e9" },
  { name: "35-50", value: 432, fill: "#0284c7" },
  { name: "51-65", value: 321, fill: "#0369a1" },
  { name: "66+", value: 122, fill: "#075985" },
]

// Gender distribution data
const genderData = [
  { name: "Male", value: 580, fill: "#0ea5e9" },
  { name: "Female", value: 680, fill: "#8b5cf6" },
  { name: "Other", value: 24, fill: "#22c55e" },
]

// Insurance distribution data
const insuranceData = [
  { name: "Private", value: 720 },
  { name: "Medicare", value: 340 },
  { name: "Medicaid", value: 180 },
  { name: "Self-Pay", value: 44 },
]

const COLORS = ["#0284c7", "#0369a1", "#075985", "#0c4a6e"]

export function PatientChart() {
  const [activeTab, setActiveTab] = useState("age")
  const [chartType, setChartType] = useState("bar")
  const [selectedMetric, setSelectedMetric] = useState("age")

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

  const getCurrentData = () => {
    switch (selectedMetric) {
      case "age":
        return ageData
      case "gender":
        return genderData
      case "visits":
        return insuranceData
      default:
        return ageData
    }
  }

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("bar")}
            className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Barras
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("pie")}
            className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
          >
            <PieChart className="h-4 w-4 mr-1" />
            Circular
          </Button>
        </div>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
            <SelectItem value="age" className="dark:text-white dark:focus:bg-slate-700">Distribución por Edad</SelectItem>
            <SelectItem value="gender" className="dark:text-white dark:focus:bg-slate-700">Distribución por Género</SelectItem>
            <SelectItem value="visits" className="dark:text-white dark:focus:bg-slate-700">Visitas Mensuales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full p-4 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700">
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border dark:border-slate-700">
          <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {getCurrentData().reduce((sum, item) => sum + item.value, 0)}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">Total Pacientes</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border dark:border-slate-700">
          <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-900 dark:text-green-300">+12%</p>
          <p className="text-sm text-green-700 dark:text-green-400">Crecimiento</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border dark:border-slate-700">
          <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">89%</p>
          <p className="text-sm text-purple-700 dark:text-purple-400">Satisfacción</p>
        </div>
      </div>
    </div>
  )
}
