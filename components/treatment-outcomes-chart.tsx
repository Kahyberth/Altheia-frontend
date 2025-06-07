"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for treatment outcomes
const treatmentData = [
  {
    name: "Cardiac",
    success: 85,
    partial: 10,
    failure: 5,
  },
  {
    name: "Respiratory",
    success: 78,
    partial: 15,
    failure: 7,
  },
  {
    name: "Orthopedic",
    success: 92,
    partial: 6,
    failure: 2,
  },
  {
    name: "Neurological",
    success: 72,
    partial: 18,
    failure: 10,
  },
  {
    name: "Gastrointestinal",
    success: 88,
    partial: 9,
    failure: 3,
  },
]

// Sample data for treatment outcomes over time
const timeSeriesData = [
  { month: "Jan", success: 82, partial: 12, failure: 6 },
  { month: "Feb", success: 83, partial: 11, failure: 6 },
  { month: "Mar", success: 84, partial: 10, failure: 6 },
  { month: "Apr", success: 85, partial: 10, failure: 5 },
  { month: "May", success: 87, partial: 9, failure: 4 },
  { month: "Jun", success: 88, partial: 8, failure: 4 },
]

export function TreatmentOutcomesChart() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [dataType, setDataType] = useState<"category" | "time">("category")

  const activeData = dataType === "category" ? treatmentData : timeSeriesData

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          defaultValue="category"
          onValueChange={(value) => setDataType(value as "category" | "time")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="category" className="text-xs">
              By Category
            </TabsTrigger>
            <TabsTrigger value="time" className="text-xs">
              Over Time
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          defaultValue="bar"
          onValueChange={(value) => setChartType(value as "bar" | "line")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="bar" className="text-xs">
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="line" className="text-xs">
              Line Chart
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${dataType}-${chartType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey={dataType === "category" ? "name" : "month"} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="success" name="Success" fill="#0ea5e9" animationDuration={750} />
                  <Bar dataKey="partial" name="Partial Success" fill="#38bdf8" animationDuration={750} />
                  <Bar dataKey="failure" name="Failure" fill="#7dd3fc" animationDuration={750} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey={dataType === "category" ? "name" : "month"} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="success"
                    name="Success"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={750}
                  />
                  <Line
                    type="monotone"
                    dataKey="partial"
                    name="Partial Success"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={750}
                  />
                  <Line
                    type="monotone"
                    dataKey="failure"
                    name="Failure"
                    stroke="#7dd3fc"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={750}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
