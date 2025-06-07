"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, FileSpreadsheet, FileIcon as FilePdf, FileJson, FileImage, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportExportDialog({ open, onOpenChange }: ReportExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportTab, setExportTab] = useState("current")
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)

      // Reset success state after a delay
      setTimeout(() => {
        setExportSuccess(false)
        onOpenChange(false)
      }, 1500)
    }, 2000)
  }

  const exportFormats = [
    { id: "pdf", name: "PDF Document", icon: FilePdf, description: "Portable Document Format" },
    { id: "excel", name: "Excel Spreadsheet", icon: FileSpreadsheet, description: "Microsoft Excel (.xlsx)" },
    { id: "csv", name: "CSV File", icon: FileText, description: "Comma-Separated Values" },
    { id: "json", name: "JSON Data", icon: FileJson, description: "JavaScript Object Notation" },
    { id: "image", name: "Image", icon: FileImage, description: "PNG Image Format" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>Choose your export format and options</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>What would you like to export?</Label>
            <Tabs defaultValue="current" onValueChange={setExportTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current View</TabsTrigger>
                <TabsTrigger value="all">All Analytics</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>

            {exportTab === "custom" && (
              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="Enter a name for your report" />
                </div>
                <div className="space-y-3">
                  <Label>Include Sections</Label>
                  <div className="space-y-2">
                    {[
                      "Patient Demographics",
                      "Treatment Outcomes",
                      "Operational Metrics",
                      "Financial Analytics",
                      "Provider Performance",
                    ].map((section) => (
                      <div key={section} className="flex items-center space-x-2">
                        <Checkbox
                          id={`section-${section}`}
                          defaultChecked={section === "Patient Demographics" || section === "Treatment Outcomes"}
                        />
                        <Label htmlFor={`section-${section}`} className="text-sm font-normal">
                          {section}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Export Format</Label>
            <RadioGroup defaultValue="pdf" onValueChange={setExportFormat} className="space-y-3">
              {exportFormats.map((format) => (
                <div key={format.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={format.id} id={`format-${format.id}`} className="peer sr-only" />
                  <Label
                    htmlFor={`format-${format.id}`}
                    className="flex flex-1 items-center justify-between rounded-md border border-slate-200 p-4 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-blue-500 hover:bg-slate-50 [&:has([data-state=checked])]:border-blue-500"
                  >
                    <div className="flex items-center gap-3">
                      <format.icon className="h-5 w-5 text-slate-600" />
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs text-slate-500">{format.description}</div>
                      </div>
                    </div>
                    {exportFormat === format.id && <Check className="h-5 w-5 text-blue-500" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="include-charts" defaultChecked />
                <Label htmlFor="include-charts" className="text-sm font-normal">
                  Include charts and visualizations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-tables" defaultChecked />
                <Label htmlFor="include-tables" className="text-sm font-normal">
                  Include data tables
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-metadata" />
                <Label htmlFor="include-metadata" className="text-sm font-normal">
                  Include metadata and timestamps
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || exportSuccess} className="min-w-[120px]">
            {isExporting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Download className="mr-2 h-4 w-4" />
                </motion.div>
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Exported!
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
