"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for diagnosis distribution
const diagnosisData = [
  { name: "Hypertension", value: 24, color: "#0ea5e9" },
  { name: "Diabetes", value: 18, color: "#38bdf8" },
  { name: "Asthma", value: 12, color: "#7dd3fc" },
  { name: "Arthritis", value: 10, color: "#0284c7" },
  { name: "Depression", value: 8, color: "#0369a1" },
  { name: "COPD", value: 7, color: "#60a5fa" },
  { name: "Other", value: 21, color: "#93c5fd" },
]

// Sample data for diagnosis by age group
const diagnosisByAgeData = [
  { name: "0-17", hypertension: 2, diabetes: 3, asthma: 8, arthritis: 1, depression: 3, copd: 1, other: 10 },
  { name: "18-34", hypertension: 10, diabetes: 8, asthma: 12, arthritis: 5, depression: 15, copd: 3, other: 20 },
  { name: "35-50", hypertension: 25, diabetes: 20, asthma: 10, arthritis: 15, depression: 12, copd: 8, other: 25 },
  { name: "51-65", hypertension: 35, diabetes: 30, asthma: 8, arthritis: 25, depression: 10, copd: 15, other: 20 },
  { name: "65+", hypertension: 45, diabetes: 35, asthma: 5, arthritis: 30, depression: 8, copd: 20, other: 15 },
]

export function DiagnosisDistributionChart() {
  const [viewType, setViewType] = useState<"overall" | "byAge">("overall")

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="overall"
        onValueChange={(value) => setViewType(value as "overall" | "byAge")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="overall" className="text-xs">
            Overall Distribution
          </TabsTrigger>
          <TabsTrigger value="byAge" className="text-xs">
            By Age Group
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[300px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {viewType === "overall" ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={750}
                  >
                    {diagnosisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                <p className="text-sm text-slate-500">Age-based diagnosis distribution visualization</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
