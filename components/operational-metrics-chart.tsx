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
  ComposedChart,
  Area,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for operational metrics
const appointmentData = [
  { day: "Mon", scheduled: 45, completed: 42, cancelled: 3, waitTime: 12 },
  { day: "Tue", scheduled: 52, completed: 48, cancelled: 4, waitTime: 15 },
  { day: "Wed", scheduled: 48, completed: 45, cancelled: 3, waitTime: 14 },
  { day: "Thu", scheduled: 50, completed: 47, cancelled: 3, waitTime: 13 },
  { day: "Fri", scheduled: 55, completed: 50, cancelled: 5, waitTime: 16 },
  { day: "Sat", scheduled: 30, completed: 28, cancelled: 2, waitTime: 10 },
  { day: "Sun", scheduled: 15, completed: 14, cancelled: 1, waitTime: 8 },
]

// Sample data for resource utilization
const resourceData = [
  { hour: "8AM", utilization: 45, patients: 8 },
  { hour: "9AM", utilization: 75, patients: 12 },
  { hour: "10AM", utilization: 90, patients: 15 },
  { hour: "11AM", utilization: 85, patients: 14 },
  { hour: "12PM", utilization: 60, patients: 10 },
  { hour: "1PM", utilization: 50, patients: 8 },
  { hour: "2PM", utilization: 80, patients: 13 },
  { hour: "3PM", utilization: 85, patients: 14 },
  { hour: "4PM", utilization: 70, patients: 12 },
  { hour: "5PM", utilization: 50, patients: 8 },
]

export function OperationalMetricsChart() {
  const [metricType, setMetricType] = useState<"appointments" | "resources">("appointments")
  const [chartType, setChartType] = useState<"bar" | "line" | "composed">("bar")

  const activeData = metricType === "appointments" ? appointmentData : resourceData

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          defaultValue="appointments"
          onValueChange={(value) => setMetricType(value as "appointments" | "resources")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="appointments" className="text-xs">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">
              Resource Usage
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          defaultValue="bar"
          onValueChange={(value) => setChartType(value as "bar" | "line" | "composed")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="bar" className="text-xs">
              Bar
            </TabsTrigger>
            <TabsTrigger value="line" className="text-xs">
              Line
            </TabsTrigger>
            <TabsTrigger value="composed" className="text-xs">
              Combined
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${metricType}-${chartType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {metricType === "appointments" ? (
              <>
                {chartType === "bar" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="scheduled" name="Scheduled" fill="#0ea5e9" animationDuration={750} />
                      <Bar dataKey="completed" name="Completed" fill="#38bdf8" animationDuration={750} />
                      <Bar dataKey="cancelled" name="Cancelled" fill="#7dd3fc" animationDuration={750} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {chartType === "line" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
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
                        dataKey="scheduled"
                        name="Scheduled"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        name="Completed"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                      <Line
                        type="monotone"
                        dataKey="cancelled"
                        name="Cancelled"
                        stroke="#7dd3fc"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {chartType === "composed" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="scheduled" name="Scheduled" fill="#0ea5e9" animationDuration={750} />
                      <Bar yAxisId="left" dataKey="completed" name="Completed" fill="#38bdf8" animationDuration={750} />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="waitTime"
                        name="Wait Time (min)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </>
            ) : (
              <>
                {chartType === "bar" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="utilization" name="Utilization %" fill="#0ea5e9" animationDuration={750} />
                      <Bar dataKey="patients" name="Patients" fill="#38bdf8" animationDuration={750} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {chartType === "line" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip
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
                        dataKey="utilization"
                        name="Utilization %"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        name="Patients"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {chartType === "composed" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="utilization"
                        name="Utilization %"
                        fill="#0ea5e9"
                        stroke="#0ea5e9"
                        fillOpacity={0.3}
                        animationDuration={750}
                      />
                      <Bar yAxisId="right" dataKey="patients" name="Patients" fill="#38bdf8" animationDuration={750} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
