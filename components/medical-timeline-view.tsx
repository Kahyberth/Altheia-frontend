"use client"

import { motion } from "framer-motion"
import { Calendar, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface MedicalTimelineViewProps {
  records: any[]
  selectedRecord: string | null
  onSelectRecord: (id: string) => void
}

export function MedicalTimelineView({ records, selectedRecord, onSelectRecord }: MedicalTimelineViewProps) {
  // Sort records by date
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Group records by month and year
  const groupedRecords: Record<string, any[]> = {}
  sortedRecords.forEach((record) => {
    const date = new Date(record.date)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    if (!groupedRecords[monthYear]) {
      groupedRecords[monthYear] = []
    }
    groupedRecords[monthYear].push(record)
  })

  return (
    <div className="space-y-6">
      {Object.entries(groupedRecords).map(([monthYear, monthRecords]) => (
        <div key={monthYear} className="space-y-2">
          <h3 className="font-medium text-slate-500">{monthYear}</h3>
          <div className="relative ml-3 space-y-4 pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-slate-200">
            {monthRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative cursor-pointer rounded-lg border p-4 transition-colors hover:bg-slate-50 ${
                  selectedRecord === record.id ? "border-blue-300 bg-blue-50" : ""
                }`}
                onClick={() => onSelectRecord(record.id)}
              >
                <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{record.title}</h4>
                      <Badge
                        variant="outline"
                        className={`${
                          record.status === "active" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {record.status === "active" ? "Active" : "Completed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{record.provider}</p>
                    <p className="text-sm text-slate-600">{getRecordSummary(record)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-slate-500">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    {record.documents.length > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <FileText className="h-3 w-3" />
                        <span>
                          {record.documents.length} {record.documents.length === 1 ? "doc" : "docs"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function getRecordSummary(record: any) {
  switch (record.type) {
    case "diagnoses":
      return record.content.diagnosis
    case "treatments":
      return `Includes ${record.content.medications?.length || 0} medication(s) and ${
        record.content.lifestyle?.length || 0
      } lifestyle recommendation(s)`
    case "lab":
      return record.content.summary
    case "imaging":
      return record.content.impression
    case "medications":
      return `${record.content.medications?.length || 0} active medication(s)`
    case "vitals":
      return record.content.notes
    case "procedures":
      return record.content.findings
    default:
      return ""
  }
}
