"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, ArrowUp, ArrowDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Sample data for provider performance
const providerData = [
  {
    name: "Dr. Rebecca Taylor",
    specialty: "Cardiology",
    patients: 145,
    satisfaction: 98,
    readmission: 2.1,
    trend: "up",
  },
  {
    name: "Dr. Michael Johnson",
    specialty: "Neurology",
    patients: 128,
    satisfaction: 95,
    readmission: 3.2,
    trend: "up",
  },
  {
    name: "Dr. Sarah Patel",
    specialty: "Pulmonology",
    patients: 112,
    satisfaction: 97,
    readmission: 2.8,
    trend: "down",
  },
  {
    name: "Dr. David Garcia",
    specialty: "Orthopedics",
    patients: 135,
    satisfaction: 94,
    readmission: 3.5,
    trend: "up",
  },
  {
    name: "Dr. Emily Chen",
    specialty: "Endocrinology",
    patients: 98,
    satisfaction: 96,
    readmission: 2.9,
    trend: "down",
  },
]

type SortField = "name" | "patients" | "satisfaction" | "readmission"
type SortDirection = "asc" | "desc"

export function ProviderPerformanceTable() {
  const [sortField, setSortField] = useState<SortField>("patients")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedData = [...providerData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-600">
                <Button variant="ghost" size="sm" className="h-8 -ml-3 font-medium" onClick={() => handleSort("name")}>
                  Provider
                  <ArrowUpDown
                    className={`ml-1 h-3.5 w-3.5 ${sortField === "name" ? "text-blue-600" : "text-slate-400"}`}
                  />
                </Button>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-600">Specialty</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-600">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 -ml-3 font-medium"
                  onClick={() => handleSort("patients")}
                >
                  Patients
                  <ArrowUpDown
                    className={`ml-1 h-3.5 w-3.5 ${sortField === "patients" ? "text-blue-600" : "text-slate-400"}`}
                  />
                </Button>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-600">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-medium"
                    onClick={() => handleSort("satisfaction")}
                  >
                    Satisfaction
                    <ArrowUpDown
                      className={`ml-1 h-3.5 w-3.5 ${sortField === "satisfaction" ? "text-blue-600" : "text-slate-400"}`}
                    />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3.5 w-3.5 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Patient satisfaction score (0-100)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-600">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-medium"
                    onClick={() => handleSort("readmission")}
                  >
                    Readmission
                    <ArrowUpDown
                      className={`ml-1 h-3.5 w-3.5 ${sortField === "readmission" ? "text-blue-600" : "text-slate-400"}`}
                    />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3.5 w-3.5 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">30-day readmission rate (%)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-600">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((provider, index) => (
              <motion.tr
                key={provider.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="border-t border-slate-200"
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium">{provider.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{provider.specialty}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{provider.patients}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
                  >
                    {provider.satisfaction}%
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      provider.readmission < 3
                        ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-50 hover:text-amber-600"
                    }
                  >
                    {provider.readmission}%
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {provider.trend === "up" ? (
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span>Improving</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      <span>Declining</span>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
