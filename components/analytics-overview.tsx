"use client"

import { motion } from "framer-motion"
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

// Sample system usage data
const usageData = [
  { name: "Mon", value: 65 },
  { name: "Tue", value: 78 },
  { name: "Wed", value: 82 },
  { name: "Thu", value: 75 },
  { name: "Fri", value: 85 },
  { name: "Sat", value: 45 },
  { name: "Sun", value: 30 },
]

// Sample resource usage data
const resourceData = [
  { name: "EHR Access", value: 45 },
  { name: "Prescriptions", value: 25 },
  { name: "Lab Orders", value: 15 },
  { name: "Messaging", value: 15 },
]

const COLORS = ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc"]

export function AnalyticsOverview() {
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">System Usage (Last 7 Days)</h4>
        <motion.div initial="hidden" animate="visible" variants={chartVariants} className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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

      <div>
        <h4 className="mb-2 text-sm font-medium">Resource Usage</h4>
        <motion.div initial="hidden" animate="visible" variants={chartVariants} className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resourceData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {resourceData.map((entry, index) => (
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
                formatter={(value) => [`${value}%`, "Usage"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {resourceData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
