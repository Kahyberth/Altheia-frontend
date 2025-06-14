"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, FileText, Calendar, User, Search, Loader2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DocumentViewer } from "@/components/document-viewer"

// Sample medical history data
const medicalHistoryData = [
  {
    id: "mh-001",
    title: "Annual Physical Examination",
    date: "2025-05-15",
    doctor: "Dr. Rebecca Taylor",
    specialty: "General Medicine",
    type: "examination",
    summary: "Routine annual physical examination. All vitals normal. No significant findings.",
    documentUrl: "#",
    documentSize: "1.2 MB",
    documentType: "pdf",
    uploadedAt: "2025-05-16T10:30:00",
    uploadedBy: "Dr. Rebecca Taylor",
  },
  {
    id: "mh-002",
    title: "Cardiology Consultation",
    date: "2025-03-22",
    doctor: "Dr. Michael Chen",
    specialty: "Cardiology",
    type: "consultation",
    summary:
      "Follow-up consultation for mild hypertension. Blood pressure slightly elevated at 140/85. Recommended continued medication and lifestyle modifications.",
    documentUrl: "#",
    documentSize: "2.4 MB",
    documentType: "pdf",
    uploadedAt: "2025-03-23T14:15:00",
    uploadedBy: "Dr. Michael Chen",
  },
  {
    id: "mh-003",
    title: "Dermatology Visit",
    date: "2025-02-10",
    doctor: "Dr. Sophia Rodriguez",
    specialty: "Dermatology",
    type: "consultation",
    summary:
      "Evaluation of skin rash on forearm. Diagnosed as contact dermatitis. Prescribed topical corticosteroid cream.",
    documentUrl: "#",
    documentSize: "3.1 MB",
    documentType: "pdf",
    uploadedAt: "2025-02-10T16:45:00",
    uploadedBy: "Dr. Sophia Rodriguez",
  },
  {
    id: "mh-004",
    title: "Laboratory Results",
    date: "2025-01-05",
    doctor: "Dr. Rebecca Taylor",
    specialty: "General Medicine",
    type: "lab",
    summary:
      "Complete blood count, lipid panel, and comprehensive metabolic panel. Cholesterol slightly elevated at 210 mg/dL. Other results within normal ranges.",
    documentUrl: "#",
    documentSize: "1.8 MB",
    documentType: "pdf",
    uploadedAt: "2025-01-07T09:20:00",
    uploadedBy: "Lab Technician",
  },
  {
    id: "mh-005",
    title: "Orthopedic Evaluation",
    date: "2024-11-18",
    doctor: "Dr. James Wilson",
    specialty: "Orthopedics",
    type: "consultation",
    summary:
      "Evaluation of persistent knee pain. X-ray showed mild osteoarthritis. Recommended physical therapy and anti-inflammatory medication.",
    documentUrl: "#",
    documentSize: "4.5 MB",
    documentType: "pdf",
    uploadedAt: "2024-11-19T11:10:00",
    uploadedBy: "Dr. James Wilson",
  },
]

export function PatientMedicalHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterYear, setFilterYear] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  // Get unique years from the data
  const years = [...new Set(medicalHistoryData.map((record) => new Date(record.date).getFullYear().toString()))].sort(
    (a, b) => Number.parseInt(b) - Number.parseInt(a),
  )

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter records based on search term, type, and year
  const filteredRecords = medicalHistoryData.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || record.type === filterType

    const recordYear = new Date(record.date).getFullYear().toString()
    const matchesYear = filterYear === "all" || recordYear === filterYear

    return matchesSearch && matchesType && matchesYear
  })

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record)
    setViewerOpen(true)
  }

  const handleDownloadPdf = (record: any) => {
    setIsGeneratingPdf(true)

    // Simulate PDF generation and download
    setTimeout(() => {
      setIsGeneratingPdf(false)
      // In a real implementation, this would trigger the actual download
      alert(`Downloading: ${record.title}`)
    }, 2000)
  }

  const handleDownloadAllRecords = () => {
    setIsGeneratingPdf(true)

    // Simulate generating a comprehensive PDF with all records
    setTimeout(() => {
      setIsGeneratingPdf(false)
      // In a real implementation, this would trigger the actual download
      alert("Downloading complete medical history")
    }, 3000)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
              <FileText className="absolute inset-0 m-auto h-6 w-6 text-white" />
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 150 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
              className="mt-6 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
            />
            <p className="mt-4 text-sm text-slate-600">Loading your medical history...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medical History</h1>
          <p className="text-muted-foreground">View and download your complete medical records</p>
        </div>
        <Button
          onClick={handleDownloadAllRecords}
          disabled={isGeneratingPdf}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Complete History
            </>
          )}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-[1fr_250px]"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>{filteredRecords.length} records found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search records..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="examination">Examinations</SelectItem>
                    <SelectItem value="consultation">Consultations</SelectItem>
                    <SelectItem value="lab">Lab Results</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="list" className="mt-4">
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-4 space-y-0">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <motion.div
                        key={record.id}
                        variants={itemVariants}
                        className="group flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{record.title}</h3>
                            {record.type === "examination" && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                Examination
                              </Badge>
                            )}
                            {record.type === "consultation" && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                Consultation
                              </Badge>
                            )}
                            {record.type === "lab" && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                                Lab Results
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3.5 w-3.5" />
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <User className="mr-1 h-3.5 w-3.5" />
                              {record.doctor}
                            </span>
                            <span>{record.specialty}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{record.summary}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleDownloadPdf(record)}
                            disabled={isGeneratingPdf}
                          >
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            Download
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="rounded-full bg-slate-100 p-3">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">No records found</h3>
                      <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <div className="relative pl-6">
                  <div className="absolute left-2.5 top-0 h-full w-0.5 bg-slate-200"></div>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <motion.div key={record.id} variants={itemVariants} className="relative">
                          <div className="absolute -left-[22px] flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                record.type === "examination"
                                  ? "bg-green-500"
                                  : record.type === "consultation"
                                    ? "bg-blue-500"
                                    : "bg-purple-500"
                              }`}
                            ></div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-medium">{record.title}</h3>
                              <span className="text-xs text-slate-500">
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{record.summary}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {record.doctor} • {record.specialty}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleViewRecord(record)}
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleDownloadPdf(record)}
                                  disabled={isGeneratingPdf}
                                >
                                  <Download className="mr-1 h-3 w-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <div className="rounded-full bg-slate-100 p-3">
                          <FileText className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No records found</h3>
                        <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Health Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Type:</span>
                    <span className="font-medium">A+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allergies:</span>
                    <span className="font-medium">Penicillin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chronic Conditions:</span>
                    <span className="font-medium">Hypertension</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Physical:</span>
                    <span className="font-medium">May 15, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Lisinopril 10mg</p>
                      <p className="text-xs text-slate-500">1 tablet daily</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Active
                    </Badge>
                  </li>
                  <li className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Atorvastatin 20mg</p>
                      <p className="text-xs text-slate-500">1 tablet at bedtime</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Active
                    </Badge>
                  </li>
                  <li className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Metformin 500mg</p>
                      <p className="text-xs text-slate-500">1 tablet twice daily</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Active
                    </Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" className="h-auto p-0 text-sm">
                  View medication details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  If you need assistance understanding your medical records or have questions about your health history,
                  please contact your healthcare provider.
                </p>
                <Button className="mt-4 w-full">Contact Support</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Document Viewer Dialog */}
      <AnimatePresence>
        {selectedRecord && (
          <DocumentViewer
            open={viewerOpen}
            onOpenChange={setViewerOpen}
            document={selectedRecord}
            patientName="Sarah Johnson"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
