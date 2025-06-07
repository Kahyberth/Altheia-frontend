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
  LineChart,
  Line,
  Legend,
} from "recharts"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LabResultsChartProps {
  results: any[]
}

export function LabResultsChart({ results }: LabResultsChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")

  // Prepare data for the chart
  const chartData = results.map((result) => {
    // Calculate percentage of value within range
    const rangeValues = result.range.split("-").map((v: string) => Number.parseFloat(v.trim()))
    const min = rangeValues[0]
    const max = rangeValues[1]
    const range = max - min
    const percentage = ((result.value - min) / range) * 100

    return {
      name: result.name,
      value: result.value,
      min,
      max,
      percentage,
      status: result.status,
      unit: result.unit,
    }
  })

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            Value: {data.value} {data.unit}
          </p>
          <p className="text-sm">
            Range: {data.min}-{data.max} {data.unit}
          </p>
          <p className={`text-sm font-medium ${getStatusColor(data.status)}`}>
            Status: {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </p>
        </div>
      )
    }
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600"
      case "high":
        return "text-red-600"
      case "low":
        return "text-blue-600"
      case "borderline":
        return "text-amber-600"
      default:
        return "text-slate-600"
    }
  }

  const getBarColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#22c55e" // green-500
      case "high":
        return "#ef4444" // red-500
      case "low":
        return "#3b82f6" // blue-500
      case "borderline":
        return "#f59e0b" // amber-500
      default:
        return "#64748b" // slate-500
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="bar" onValueChange={(value) => setChartType(value as "bar" | "line")}>
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px]">
        <motion.div
          key={chartType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  fill="#3b82f6"
                  name="Value"
                  isAnimationActive={true}
                >
                  {chartData.map((entry, index) => (
                    <motion.rect
                      key={`bar-${index}`}
                      initial={{ y: 300, height: 0 }}
                      animate={{ y: 0, height: "auto" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      fill={getBarColor(entry.status)}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                  name="Value"
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Min Range"
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Max Range"
                  isAnimationActive={true}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
