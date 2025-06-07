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

  return (
    <div className="space-y-4">
      <Tabs defaultValue="age" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="age">Age</TabsTrigger>
          <TabsTrigger value="gender">Gender</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <div className="mt-4 h-[300px]">
          <TabsContent value="age" className="h-full">
            <motion.div
              key="age"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={chartVariants}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
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
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="gender" className="h-full">
            <motion.div
              key="gender"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={chartVariants}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="insurance" className="h-full">
            <motion.div
              key="insurance"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={chartVariants}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insuranceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {insuranceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
