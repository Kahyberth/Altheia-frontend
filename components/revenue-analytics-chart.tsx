"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for revenue analytics
const monthlyRevenueData = [
  { month: "Jan", revenue: 125000, expenses: 95000, profit: 30000 },
  { month: "Feb", revenue: 132000, expenses: 97000, profit: 35000 },
  { month: "Mar", revenue: 141000, expenses: 99000, profit: 42000 },
  { month: "Apr", revenue: 138000, expenses: 98000, profit: 40000 },
  { month: "May", revenue: 145000, expenses: 100000, profit: 45000 },
  { month: "Jun", revenue: 152000, expenses: 102000, profit: 50000 },
  { month: "Jul", revenue: 159000, expenses: 105000, profit: 54000 },
  { month: "Aug", revenue: 148000, expenses: 103000, profit: 45000 },
  { month: "Sep", revenue: 156000, expenses: 104000, profit: 52000 },
  { month: "Oct", revenue: 162000, expenses: 106000, profit: 56000 },
  { month: "Nov", revenue: 168000, expenses: 108000, profit: 60000 },
  { month: "Dec", revenue: 175000, expenses: 110000, profit: 65000 },
]

// Sample data for revenue by service type
const revenueByServiceData = [
  { service: "Primary Care", revenue: 450000 },
  { service: "Specialty Care", revenue: 680000 },
  { service: "Diagnostics", revenue: 320000 },
  { service: "Procedures", revenue: 520000 },
  { service: "Pharmacy", revenue: 280000 },
]

export function RevenueAnalyticsChart() {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line")
  const [dataType, setDataType] = useState<"monthly" | "service">("monthly")

  const activeData = dataType === "monthly" ? monthlyRevenueData : revenueByServiceData

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          defaultValue="monthly"
          onValueChange={(value) => setDataType(value as "monthly" | "service")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="monthly" className="text-xs">
              Monthly Trend
            </TabsTrigger>
            <TabsTrigger value="service" className="text-xs">
              By Service
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          defaultValue="line"
          onValueChange={(value) => setChartType(value as "line" | "area" | "bar")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="line" className="text-xs">
              Line
            </TabsTrigger>
            <TabsTrigger value="area" className="text-xs">
              Area
            </TabsTrigger>
            <TabsTrigger value="bar" className="text-xs">
              Bar
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
            {dataType === "monthly" ? (
              <>
                {chartType === "line" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value as number), ""]}
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
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={750}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {chartType === "area" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value as number), ""]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        fill="#0ea5e9"
                        stroke="#0ea5e9"
                        fillOpacity={0.3}
                        animationDuration={750}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        fill="#f97316"
                        stroke="#f97316"
                        fillOpacity={0.3}
                        animationDuration={750}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        fill="#22c55e"
                        stroke="#22c55e"
                        fillOpacity={0.3}
                        animationDuration={750}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {chartType === "bar" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value as number), ""]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" animationDuration={750} />
                      <Bar dataKey="expenses" name="Expenses" fill="#f97316" animationDuration={750} />
                      <Bar dataKey="profit" name="Profit" fill="#22c55e" animationDuration={750} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueByServiceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout={chartType === "bar" ? "vertical" : "horizontal"}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="service" type={chartType === "bar" ? "category" : "number"} />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    type={chartType === "bar" ? "number" : "category"}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" animationDuration={750} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
