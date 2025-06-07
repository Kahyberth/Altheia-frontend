"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  LineChart,
  PieChart,
  FileText,
  Clock,
  Activity,
  MoreHorizontal,
  Star,
  StarOff,
  Edit,
  Copy,
  Share2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for saved reports
const savedReportsData = [
  {
    id: 1,
    name: "Monthly Patient Demographics",
    description: "Analysis of patient demographics and trends",
    type: "chart",
    chartType: "pie",
    lastRun: "2 days ago",
    favorite: true,
    category: "Patient",
  },
  {
    id: 2,
    name: "Quarterly Revenue Analysis",
    description: "Financial performance and revenue streams",
    type: "chart",
    chartType: "bar",
    lastRun: "1 week ago",
    favorite: true,
    category: "Financial",
  },
  {
    id: 3,
    name: "Provider Performance Report",
    description: "Metrics and KPIs for healthcare providers",
    type: "table",
    lastRun: "3 days ago",
    favorite: false,
    category: "Operational",
  },
  {
    id: 4,
    name: "Treatment Outcomes Summary",
    description: "Analysis of clinical outcomes by treatment type",
    type: "chart",
    chartType: "line",
    lastRun: "Yesterday",
    favorite: false,
    category: "Clinical",
  },
  {
    id: 5,
    name: "Appointment Analytics",
    description: "Metrics on appointment scheduling and attendance",
    type: "chart",
    chartType: "bar",
    lastRun: "4 days ago",
    favorite: false,
    category: "Operational",
  },
]

export function SavedReportsList() {
  const [reports, setReports] = useState(savedReportsData)

  const toggleFavorite = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, favorite: !report.favorite } : report)))
  }

  const getIconForReport = (report: (typeof savedReportsData)[0]) => {
    if (report.type === "table") return FileText

    switch (report.chartType) {
      case "bar":
        return BarChart3
      case "line":
        return LineChart
      case "pie":
        return PieChart
      default:
        return FileText
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Patient":
        return "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
      case "Financial":
        return "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
      case "Operational":
        return "bg-amber-50 text-amber-600 hover:bg-amber-50 hover:text-amber-600"
      case "Clinical":
        return "bg-cyan-50 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-600"
      default:
        return "bg-slate-50 text-slate-600 hover:bg-slate-50 hover:text-slate-600"
    }
  }

  return (
    <div className="space-y-4">
      {reports.map((report, index) => {
        const ReportIcon = getIconForReport(report)

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-slate-100 p-2">
                <ReportIcon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{report.name}</h3>
                  {report.favorite && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                </div>
                <p className="text-sm text-slate-500">{report.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="outline" className={getCategoryColor(report.category)}>
                    {report.category}
                  </Badge>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    <span>Last run: {report.lastRun}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Run</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleFavorite(report.id)}>
                    {report.favorite ? (
                      <>
                        <StarOff className="mr-2 h-4 w-4" />
                        <span>Remove from favorites</span>
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        <span>Add to favorites</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit report</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
