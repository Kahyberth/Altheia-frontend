"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for patient demographics
const ageData = [
  { name: "0-17", value: 15, color: "#0ea5e9" },
  { name: "18-34", value: 25, color: "#38bdf8" },
  { name: "35-50", value: 30, color: "#7dd3fc" },
  { name: "51-65", value: 20, color: "#0284c7" },
  { name: "65+", value: 10, color: "#0369a1" },
]

const genderData = [
  { name: "Male", value: 48, color: "#0ea5e9" },
  { name: "Female", value: 51, color: "#38bdf8" },
  { name: "Other", value: 1, color: "#7dd3fc" },
]

const insuranceData = [
  { name: "Private", value: 65, color: "#0ea5e9" },
  { name: "Medicare", value: 20, color: "#38bdf8" },
  { name: "Medicaid", value: 10, color: "#7dd3fc" },
  { name: "Self-Pay", value: 5, color: "#0284c7" },
]

export function PatientDemographicsChart() {
  const [activeView, setActiveView] = useState("age")
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")

  // Determine which data set to use based on active view
  const getActiveData = () => {
    switch (activeView) {
      case "age":
        return ageData
      case "gender":
        return genderData
      case "insurance":
        return insuranceData
      default:
        return ageData
    }
  }

  const activeData = getActiveData()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs defaultValue="age" onValueChange={setActiveView} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="age" className="text-xs">
              Age
            </TabsTrigger>
            <TabsTrigger value="gender" className="text-xs">
              Gender
            </TabsTrigger>
            <TabsTrigger value="insurance" className="text-xs">
              Insurance
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          defaultValue="pie"
          onValueChange={(value) => setChartType(value as "pie" | "bar")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="pie" className="text-xs">
              Pie Chart
            </TabsTrigger>
            <TabsTrigger value="bar" className="text-xs">
              Bar Chart
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeView}-${chartType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {chartType === "pie" ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={750}
                  >
                    {activeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="value" animationDuration={750}>
                    {activeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
