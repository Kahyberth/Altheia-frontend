"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Search,
  Filter,
  Calendar,
  FileImage,
  FilePlus,
  Download,
  Printer,
  Share2,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  History,
  Lock,
  Shield,
  User,
  Clipboard,
  Microscope,
  Stethoscope,
  Activity,
  Pill,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { DocumentViewer } from "@/components/document-viewer"
import { LabResultsChart } from "@/components/lab-results-chart"
import { MedicalTimelineView } from "@/components/medical-timeline-view"
import { DocumentUploader } from "@/components/document-uploader"
import { ImageViewer } from "@/components/image-viewer"

// Sample patient data
const patients = [
  {
    id: "P-1001",
    name: "Sarah Johnson",
    age: 42,
    gender: "Female",
    dob: "1981-05-10",
    mrn: "MRN-10042",
    avatar: "/placeholder.svg?height=128&width=128&text=SJ",
  },
  {
    id: "P-1002",
    name: "Michael Chen",
    age: 35,
    gender: "Male",
    dob: "1988-09-22",
    mrn: "MRN-10043",
    avatar: "/placeholder.svg?height=128&width=128&text=MC",
  },
  {
    id: "P-1003",
    name: "Amanda Rodriguez",
    age: 28,
    gender: "Female",
    dob: "1995-03-15",
    mrn: "MRN-10044",
    avatar: "/placeholder.svg?height=128&width=128&text=AR",
  },
]

// Sample medical record categories
const recordCategories = [
  { id: "all", name: "All Records", icon: FileText },
  { id: "diagnoses", name: "Diagnoses", icon: Stethoscope },
  { id: "treatments", name: "Treatment Plans", icon: Clipboard },
  { id: "lab", name: "Lab Results", icon: Microscope },
  { id: "imaging", name: "Imaging", icon: FileImage },
  { id: "medications", name: "Medications", icon: Pill },
  { id: "vitals", name: "Vital Signs", icon: Activity },
  { id: "procedures", name: "Procedures", icon: Zap },
]

// Sample medical records
const medicalRecords = [
  {
    id: "REC-1001",
    patientId: "P-1001",
    type: "diagnoses",
    title: "Hypertension Diagnosis",
    date: "2023-04-15",
    provider: "Dr. Rebecca Taylor",
    status: "active",
    content: {
      diagnosis: "Essential (primary) hypertension",
      icdCode: "I10",
      notes:
        "Patient presents with consistently elevated blood pressure readings over multiple visits. Recommended lifestyle modifications and medication.",
      followUp: "2 weeks",
    },
    documents: [
      {
        id: "DOC-1001",
        name: "Hypertension Assessment.pdf",
        type: "pdf",
        size: "1.2 MB",
        uploadedBy: "Dr. Rebecca Taylor",
        uploadedAt: "2023-04-15T14:30:00",
        url: "#",
      },
    ],
  },
  {
    id: "REC-1002",
    patientId: "P-1001",
    type: "lab",
    title: "Comprehensive Metabolic Panel",
    date: "2023-04-10",
    provider: "LabCorp",
    status: "completed",
    content: {
      results: [
        { name: "Glucose", value: 92, unit: "mg/dL", range: "70-99", status: "normal" },
        { name: "BUN", value: 18, unit: "mg/dL", range: "7-20", status: "normal" },
        { name: "Creatinine", value: 0.9, unit: "mg/dL", range: "0.6-1.2", status: "normal" },
        { name: "Sodium", value: 141, unit: "mmol/L", range: "136-145", status: "normal" },
        { name: "Potassium", value: 4.5, unit: "mmol/L", range: "3.5-5.1", status: "normal" },
        { name: "Chloride", value: 102, unit: "mmol/L", range: "98-107", status: "normal" },
        { name: "CO2", value: 24, unit: "mmol/L", range: "22-29", status: "normal" },
        { name: "Calcium", value: 9.5, unit: "mg/dL", range: "8.5-10.2", status: "normal" },
        { name: "Total Protein", value: 7.2, unit: "g/dL", range: "6.4-8.2", status: "normal" },
        { name: "Albumin", value: 4.3, unit: "g/dL", range: "3.5-5.0", status: "normal" },
        { name: "Bilirubin, Total", value: 0.8, unit: "mg/dL", range: "0.1-1.2", status: "normal" },
        { name: "Alkaline Phosphatase", value: 68, unit: "U/L", range: "40-129", status: "normal" },
        { name: "AST", value: 22, unit: "U/L", range: "0-40", status: "normal" },
        { name: "ALT", value: 25, unit: "U/L", range: "0-44", status: "normal" },
      ],
      summary: "All values within normal range. No significant abnormalities detected.",
    },
    documents: [
      {
        id: "DOC-1002",
        name: "CMP Results.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedBy: "LabCorp",
        uploadedAt: "2023-04-10T09:15:00",
        url: "#",
      },
    ],
  },
  {
    id: "REC-1003",
    patientId: "P-1001",
    type: "imaging",
    title: "Chest X-Ray",
    date: "2023-04-05",
    provider: "Radiology Dept.",
    status: "completed",
    content: {
      procedure: "PA and lateral chest radiograph",
      findings:
        "Heart size is normal. Lungs are clear without evidence of infiltrate or effusion. No pneumothorax. No pleural effusion. Visualized bony structures are intact.",
      impression: "Normal chest radiograph. No acute cardiopulmonary process.",
    },
    documents: [
      {
        id: "DOC-1003",
        name: "Chest X-Ray.jpg",
        type: "image",
        size: "8.7 MB",
        uploadedBy: "Dr. James Wilson",
        uploadedAt: "2023-04-05T11:20:00",
        url: "/placeholder.svg?height=800&width=600&text=X-Ray+Image",
      },
      {
        id: "DOC-1004",
        name: "Radiology Report.pdf",
        type: "pdf",
        size: "1.1 MB",
        uploadedBy: "Dr. James Wilson",
        uploadedAt: "2023-04-05T14:45:00",
        url: "#",
      },
    ],
  },
  {
    id: "REC-1004",
    patientId: "P-1001",
    type: "treatments",
    title: "Hypertension Treatment Plan",
    date: "2023-04-16",
    provider: "Dr. Rebecca Taylor",
    status: "active",
    content: {
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "3 months, then reassess",
        },
      ],
      lifestyle: [
        "DASH diet with reduced sodium intake",
        "Regular aerobic exercise, 30 minutes, 5 days per week",
        "Weight loss goal of 5-10 pounds",
        "Limit alcohol consumption",
        "Smoking cessation",
      ],
      monitoring: "Home blood pressure monitoring twice daily. Record in provided log.",
      followUp: "2 weeks for medication check, then monthly for 3 months",
    },
    documents: [
      {
        id: "DOC-1005",
        name: "Hypertension Treatment Plan.pdf",
        type: "pdf",
        size: "0.9 MB",
        uploadedBy: "Dr. Rebecca Taylor",
        uploadedAt: "2023-04-16T16:20:00",
        url: "#",
      },
      {
        id: "DOC-1006",
        name: "DASH Diet Guidelines.pdf",
        type: "pdf",
        size: "1.5 MB",
        uploadedBy: "Dr. Rebecca Taylor",
        uploadedAt: "2023-04-16T16:22:00",
        url: "#",
      },
    ],
  },
  {
    id: "REC-1005",
    patientId: "P-1001",
    type: "medications",
    title: "Current Medications",
    date: "2023-04-16",
    provider: "Dr. Rebecca Taylor",
    status: "active",
    content: {
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          startDate: "2023-04-16",
          endDate: null,
          prescriber: "Dr. Rebecca Taylor",
          pharmacy: "MediCare Pharmacy",
          refills: 3,
        },
        {
          name: "Multivitamin",
          dosage: "1 tablet",
          frequency: "Once daily",
          startDate: "2022-01-10",
          endDate: null,
          prescriber: "Dr. Rebecca Taylor",
          pharmacy: "Over the counter",
          refills: null,
        },
      ],
      allergies: ["Penicillin - Hives", "Sulfa drugs - Rash"],
    },
    documents: [
      {
        id: "DOC-1007",
        name: "Medication List.pdf",
        type: "pdf",
        size: "0.7 MB",
        uploadedBy: "Dr. Rebecca Taylor",
        uploadedAt: "2023-04-16T16:25:00",
        url: "#",
      },
    ],
  },
  {
    id: "REC-1006",
    patientId: "P-1001",
    type: "vitals",
    title: "Vital Signs",
    date: "2023-04-15",
    provider: "Nurse Johnson",
    status: "completed",
    content: {
      readings: [
        { name: "Blood Pressure", value: "142/88", unit: "mmHg" },
        { name: "Heart Rate", value: 76, unit: "bpm" },
        { name: "Respiratory Rate", value: 16, unit: "breaths/min" },
        { name: "Temperature", value: 98.6, unit: "°F" },
        { name: "Oxygen Saturation", value: 98, unit: "%" },
        { name: "Weight", value: 165, unit: "lbs" },
        { name: "Height", value: 65, unit: "in" },
        { name: "BMI", value: 27.5, unit: "kg/m²" },
      ],
      notes: "Blood pressure elevated. Patient reports compliance with current medications.",
    },
    documents: [],
  },
  {
    id: "REC-1007",
    patientId: "P-1001",
    type: "lab",
    title: "Lipid Panel",
    date: "2023-04-10",
    provider: "LabCorp",
    status: "completed",
    content: {
      results: [
        { name: "Total Cholesterol", value: 210, unit: "mg/dL", range: "<200", status: "high" },
        { name: "HDL Cholesterol", value: 45, unit: "mg/dL", range: ">40", status: "normal" },
        { name: "LDL Cholesterol", value: 135, unit: "mg/dL", range: "<100", status: "high" },
        { name: "Triglycerides", value: 150, unit: "mg/dL", range: "<150", status: "borderline" },
      ],
      summary:
        "Elevated total cholesterol and LDL cholesterol. Recommend lifestyle modifications and possible medication if not improved in 3 months.",
    },
    documents: [
      {
        id: "DOC-1008",
        name: "Lipid Panel Results.pdf",
        type: "pdf",
        size: "1.8 MB",
        uploadedBy: "LabCorp",
        uploadedAt: "2023-04-10T09:20:00",
        url: "#",
      },
    ],
  },
  {
    id: "REC-1008",
    patientId: "P-1001",
    type: "procedures",
    title: "ECG",
    date: "2023-04-15",
    provider: "Dr. Rebecca Taylor",
    status: "completed",
    content: {
      procedure: "12-lead Electrocardiogram",
      findings: "Normal sinus rhythm. Rate 72 bpm. Normal axis. No ST-T wave changes. No evidence of ischemia.",
      interpretation: "Normal ECG.",
    },
    documents: [
      {
        id: "DOC-1009",
        name: "ECG Recording.pdf",
        type: "pdf",
        size: "2.2 MB",
        uploadedBy: "Dr. Rebecca Taylor",
        uploadedAt: "2023-04-15T15:10:00",
        url: "#",
      },
    ],
  },
]

// Sample audit trail entries
const auditTrail = [
  {
    id: "AUD-1001",
    recordId: "REC-1001",
    action: "view",
    user: "Dr. Rebecca Taylor",
    timestamp: "2023-05-18T09:30:45",
    details: "Viewed hypertension diagnosis record",
  },
  {
    id: "AUD-1002",
    recordId: "REC-1001",
    action: "edit",
    user: "Dr. Rebecca Taylor",
    timestamp: "2023-05-17T14:22:10",
    details: "Updated diagnosis notes",
  },
  {
    id: "AUD-1003",
    recordId: "REC-1002",
    action: "view",
    user: "Dr. James Wilson",
    timestamp: "2023-05-16T11:15:32",
    details: "Viewed lab results",
  },
  {
    id: "AUD-1004",
    recordId: "REC-1003",
    action: "upload",
    user: "Dr. James Wilson",
    timestamp: "2023-04-05T11:20:00",
    details: "Uploaded chest X-ray image",
  },
  {
    id: "AUD-1005",
    recordId: "REC-1004",
    action: "create",
    user: "Dr. Rebecca Taylor",
    timestamp: "2023-04-16T16:20:00",
    details: "Created hypertension treatment plan",
  },
]

export default function MedicalRecordsPage() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<string | null>("P-1001") // Default to first patient
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list")

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  // Filter records based on selected patient, category, search query, and date range
  const filteredRecords = medicalRecords.filter((record) => {
    // Filter by patient
    if (selectedPatient && record.patientId !== selectedPatient) return false

    // Filter by category
    if (selectedCategory !== "all" && record.type !== selectedCategory) return false

    // Filter by search query
    if (
      searchQuery &&
      !record.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !record.provider.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    // Filter by date range
    if (dateRange) {
      const recordDate = new Date(record.date)
      const startDate = dateRange.start ? new Date(dateRange.start) : null
      const endDate = dateRange.end ? new Date(dateRange.end) : null

      if (startDate && recordDate < startDate) return false
      if (endDate && recordDate > endDate) return false
    }

    return true
  })

  // Get the selected record details
  const recordDetails = selectedRecord ? medicalRecords.find((record) => record.id === selectedRecord) : null

  // Get the selected patient details
  const patientDetails = selectedPatient ? patients.find((patient) => patient.id === selectedPatient) : null

  // Get audit trail for selected record
  const recordAuditTrail = selectedRecord
    ? auditTrail
        .filter((entry) => entry.recordId === selectedRecord)
        .sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })
    : []

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document)
    if (document.type === "image") {
      setSelectedImage(document.url)
      setShowImageViewer(true)
    } else {
      setShowDocumentViewer(true)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            <FileText className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600">Loading medical records...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header is included in the DashboardSidebar component */}

        {/* Medical Records Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <motion.div variants={item} className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
              <p className="text-sm text-slate-500">View and manage patient medical records securely</p>
            </motion.div>

            {/* Patient Selection and Actions */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                      <div className="w-full md:w-64">
                        <Select
                          value={selectedPatient || ""}
                          onValueChange={(value) => {
                            setSelectedPatient(value)
                            setSelectedRecord(null)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                                    <AvatarFallback>
                                      {patient.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{patient.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {patientDetails && (
                        <div className="flex items-center gap-3 rounded-lg border bg-white p-2 md:ml-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patientDetails.avatar || "/placeholder.svg"} alt={patientDetails.name} />
                            <AvatarFallback>
                              {patientDetails.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patientDetails.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>
                                {patientDetails.age} • {patientDetails.gender}
                              </span>
                              <span>•</span>
                              <span>DOB: {new Date(patientDetails.dob).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{patientDetails.mrn}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          setShowUploadDialog(true)
                        }}
                      >
                        <FilePlus className="h-4 w-4" />
                        <span>Upload Document</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Filter Records</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="p-2">
                            <div className="mb-2 space-y-1">
                              <label className="text-xs font-medium">Date Range</label>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-xs text-slate-500">From</label>
                                    <Input
                                      type="date"
                                      className="h-8"
                                      onChange={(e) =>
                                        setDateRange((prev) => ({ ...prev, start: e.target.value }) as any)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs text-slate-500">To</label>
                                    <Input
                                      type="date"
                                      className="h-8"
                                      onChange={(e) =>
                                        setDateRange((prev) => ({ ...prev, end: e.target.value }) as any)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mb-2 space-y-1">
                              <label className="text-xs font-medium">Status</label>
                              <div className="grid gap-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="status-active" />
                                  <label htmlFor="status-active" className="text-sm">
                                    Active
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="status-completed" />
                                  <label htmlFor="status-completed" className="text-sm">
                                    Completed
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="mb-2 space-y-1">
                              <label className="text-xs font-medium">Provider</label>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="All Providers" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Providers</SelectItem>
                                  <SelectItem value="dr-taylor">Dr. Rebecca Taylor</SelectItem>
                                  <SelectItem value="dr-wilson">Dr. James Wilson</SelectItem>
                                  <SelectItem value="labcorp">LabCorp</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="pt-2">
                              <Button size="sm" className="w-full">
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="flex items-center gap-1 rounded-md border bg-white p-1">
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewMode("list")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-list"
                          >
                            <line x1="8" x2="21" y1="6" y2="6" />
                            <line x1="8" x2="21" y1="12" y2="12" />
                            <line x1="8" x2="21" y1="18" y2="18" />
                            <line x1="3" x2="3.01" y1="6" y2="6" />
                            <line x1="3" x2="3.01" y1="12" y2="12" />
                            <line x1="3" x2="3.01" y1="18" y2="18" />
                          </svg>
                          <span className="sr-only">List view</span>
                        </Button>
                        <Button
                          variant={viewMode === "timeline" ? "default" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewMode("timeline")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-gantt-chart"
                          >
                            <path d="M8 6h10" />
                            <path d="M6 12h9" />
                            <path d="M11 18h7" />
                            <path d="M6 6v12" />
                            <path d="M12 12v6" />
                            <path d="M18 6v12" />
                          </svg>
                          <span className="sr-only">Timeline view</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search and Category Filters */}
            <motion.div variants={item}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="search"
                    placeholder="Search records by title, provider, or content..."
                    className="w-full pl-8 focus-visible:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-white p-1 md:w-auto">
                  <div className="flex gap-1 p-1">
                    {recordCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className={`h-8 gap-2 ${selectedCategory === category.id ? "" : "hover:bg-slate-100"}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>

            {/* Records List and Details */}
            <motion.div variants={item} className="grid gap-4 lg:grid-cols-12">
              {/* Records List */}
              <div className={`space-y-4 ${selectedRecord ? "lg:col-span-5" : "lg:col-span-12"}`}>
                {viewMode === "list" ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Medical Records</CardTitle>
                        <div className="text-sm text-slate-500">
                          {filteredRecords.length} {filteredRecords.length === 1 ? "record" : "records"} found
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {filteredRecords.length > 0 ? (
                        <div className="divide-y">
                          <AnimatePresence>
                            {filteredRecords.map((record, index) => (
                              <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`cursor-pointer p-4 transition-colors hover:bg-slate-50 ${
                                  selectedRecord === record.id ? "bg-blue-50" : ""
                                }`}
                                onClick={() => setSelectedRecord(record.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`rounded-full p-2 ${getRecordTypeStyles(record.type).bgColor} ${
                                      getRecordTypeStyles(record.type).textColor
                                    }`}
                                  >
                                    {getRecordTypeIcon(record.type)}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-medium">{record.title}</h3>
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          record.status === "active"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-blue-50 text-blue-700"
                                        }`}
                                      >
                                        {record.status === "active" ? "Active" : "Completed"}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{new Date(record.date).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        <span>{record.provider}</span>
                                      </div>
                                      {record.documents.length > 0 && (
                                        <div className="flex items-center gap-1">
                                          <FileText className="h-3.5 w-3.5" />
                                          <span>
                                            {record.documents.length} {record.documents.length === 1 ? "doc" : "docs"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="line-clamp-2 text-sm text-slate-600">
                                      {getRecordSummary(record)}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="rounded-full bg-slate-100 p-3">
                            <Search className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium">No records found</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Try adjusting your search or filters to find what you're looking for.
                          </p>
                          <Button
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("")
                              setSelectedCategory("all")
                              setDateRange(null)
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Medical Timeline</CardTitle>
                        <div className="text-sm text-slate-500">
                          {filteredRecords.length} {filteredRecords.length === 1 ? "record" : "records"} found
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredRecords.length > 0 ? (
                        <MedicalTimelineView
                          records={filteredRecords}
                          selectedRecord={selectedRecord}
                          onSelectRecord={(id) => setSelectedRecord(id)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="rounded-full bg-slate-100 p-3">
                            <Search className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium">No records found</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Try adjusting your search or filters to find what you're looking for.
                          </p>
                          <Button
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("")
                              setSelectedCategory("all")
                              setDateRange(null)
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Record Details */}
              {selectedRecord && recordDetails && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
                  <Card className="sticky top-4">
                    <CardHeader className="flex flex-row items-start justify-between pb-3">
                      <div>
                        <CardTitle>{recordDetails.title}</CardTitle>
                        <CardDescription>
                          {new Date(recordDetails.date).toLocaleDateString()} • {recordDetails.provider}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRecord(null)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-0">
                      <Tabs defaultValue="details">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="details" className="text-xs sm:text-sm">
                            Details
                          </TabsTrigger>
                          <TabsTrigger value="documents" className="text-xs sm:text-sm">
                            Documents ({recordDetails.documents.length})
                          </TabsTrigger>
                          <TabsTrigger value="history" className="text-xs sm:text-sm">
                            Audit Trail
                          </TabsTrigger>
                        </TabsList>
                        <div className="mt-4">
                          <TabsContent value="details">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    recordDetails.status === "active"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-blue-50 text-blue-700"
                                  }`}
                                >
                                  {recordDetails.status === "active" ? "Active" : "Completed"}
                                </Badge>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <Printer className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Print</span>
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <Download className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Export</span>
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <Share2 className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Share</span>
                                  </Button>
                                </div>
                              </div>

                              {renderRecordDetails(recordDetails)}
                            </div>
                          </TabsContent>
                          <TabsContent value="documents">
                            {recordDetails.documents.length > 0 ? (
                              <div className="space-y-3">
                                {recordDetails.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`rounded-full p-2 ${
                                          doc.type === "pdf" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                                        }`}
                                      >
                                        {doc.type === "pdf" ? (
                                          <FileText className="h-4 w-4" />
                                        ) : (
                                          <FileImage className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                          <span>{doc.size}</span>
                                          <span>•</span>
                                          <span>
                                            {new Date(doc.uploadedAt).toLocaleDateString()} at{" "}
                                            {new Date(doc.uploadedAt).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDocumentClick(doc)}
                                      >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">View</span>
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="h-4 w-4" />
                                        <span className="sr-only">Download</span>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="rounded-full bg-slate-100 p-3">
                                  <FileText className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">No documents</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  This record doesn't have any associated documents.
                                </p>
                                <Button
                                  className="mt-4"
                                  onClick={() => {
                                    setShowUploadDialog(true)
                                  }}
                                >
                                  Upload Document
                                </Button>
                              </div>
                            )}
                          </TabsContent>
                          <TabsContent value="history">
                            {recordAuditTrail.length > 0 ? (
                              <div className="space-y-3">
                                {recordAuditTrail.map((entry) => (
                                  <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3">
                                    <div
                                      className={`rounded-full p-2 ${getAuditActionStyles(entry.action).bgColor} ${
                                        getAuditActionStyles(entry.action).textColor
                                      }`}
                                    >
                                      {getAuditActionIcon(entry.action)}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{entry.user}</p>
                                      <p className="text-sm text-slate-600">{entry.details}</p>
                                      <p className="text-xs text-slate-500">
                                        {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                                        {new Date(entry.timestamp).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="rounded-full bg-slate-100 p-3">
                                  <History className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">No audit trail</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  No activity has been recorded for this record yet.
                                </p>
                              </div>
                            )}
                          </TabsContent>
                        </div>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t p-4 mt-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Lock className="h-3.5 w-3.5" />
                        <span>End-to-end encrypted</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Shield className="h-3.5 w-3.5" />
                        <span>HIPAA Compliant</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Document Upload Dialog */}
      <DocumentUploader open={showUploadDialog} onOpenChange={setShowUploadDialog} patientId={selectedPatient} />

      {/* Document Viewer Dialog */}
      <DocumentViewer
        open={showDocumentViewer}
        onOpenChange={setShowDocumentViewer}
        document={selectedDocument}
        patientName={patientDetails?.name}
      />

      {/* Image Viewer Dialog */}
      <ImageViewer
        open={showImageViewer}
        onOpenChange={setShowImageViewer}
        imageUrl={selectedImage}
        title={selectedDocument?.name}
      />
    </div>
  )
}

// Helper functions
function getRecordTypeIcon(type: string) {
  switch (type) {
    case "diagnoses":
      return <Stethoscope className="h-4 w-4" />
    case "treatments":
      return <Clipboard className="h-4 w-4" />
    case "lab":
      return <Microscope className="h-4 w-4" />
    case "imaging":
      return <FileImage className="h-4 w-4" />
    case "medications":
      return <Pill className="h-4 w-4" />
    case "vitals":
      return <Activity className="h-4 w-4" />
    case "procedures":
      return <Zap className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

function getRecordTypeStyles(type: string) {
  switch (type) {
    case "diagnoses":
      return { bgColor: "bg-purple-100", textColor: "text-purple-600" }
    case "treatments":
      return { bgColor: "bg-blue-100", textColor: "text-blue-600" }
    case "lab":
      return { bgColor: "bg-green-100", textColor: "text-green-600" }
    case "imaging":
      return { bgColor: "bg-amber-100", textColor: "text-amber-600" }
    case "medications":
      return { bgColor: "bg-red-100", textColor: "text-red-600" }
    case "vitals":
      return { bgColor: "bg-cyan-100", textColor: "text-cyan-600" }
    case "procedures":
      return { bgColor: "bg-indigo-100", textColor: "text-indigo-600" }
    default:
      return { bgColor: "bg-slate-100", textColor: "text-slate-600" }
  }
}

function getAuditActionIcon(action: string) {
  switch (action) {
    case "view":
      return <Eye className="h-4 w-4" />
    case "edit":
      return <FileText className="h-4 w-4" />
    case "create":
      return <FilePlus className="h-4 w-4" />
    case "upload":
      return <FileImage className="h-4 w-4" />
    default:
      return <History className="h-4 w-4" />
  }
}

function getAuditActionStyles(action: string) {
  switch (action) {
    case "view":
      return { bgColor: "bg-blue-100", textColor: "text-blue-600" }
    case "edit":
      return { bgColor: "bg-amber-100", textColor: "text-amber-600" }
    case "create":
      return { bgColor: "bg-green-100", textColor: "text-green-600" }
    case "upload":
      return { bgColor: "bg-purple-100", textColor: "text-purple-600" }
    default:
      return { bgColor: "bg-slate-100", textColor: "text-slate-600" }
  }
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

function renderRecordDetails(record: any) {
  switch (record.type) {
    case "diagnoses":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Diagnosis</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">Condition</p>
                <p>{record.content.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">ICD Code</p>
                <p>{record.content.icdCode}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Clinical Notes</p>
              <p className="text-sm">{record.content.notes}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Follow-up</p>
              <p>{record.content.followUp}</p>
            </div>
          </div>
        </div>
      )
    case "lab":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Lab Results</h3>
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-500">Summary</p>
              <p className="text-sm">{record.content.summary}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Test</th>
                    <th className="pb-2 font-medium">Result</th>
                    <th className="pb-2 font-medium">Reference Range</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {record.content.results.map((result: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2">{result.name}</td>
                      <td className="py-2">
                        {result.value} {result.unit}
                      </td>
                      <td className="py-2">{result.range}</td>
                      <td className="py-2">
                        <Badge
                          variant="outline"
                          className={
                            result.status === "normal"
                              ? "bg-green-50 text-green-700"
                              : result.status === "high"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }
                        >
                          {result.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-medium">Results Visualization</h3>
            <LabResultsChart results={record.content.results} />
          </div>
        </div>
      )
    case "imaging":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Imaging Study</h3>
            <div>
              <p className="text-sm font-medium text-slate-500">Procedure</p>
              <p>{record.content.procedure}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Findings</p>
              <p className="text-sm">{record.content.findings}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Impression</p>
              <p className="text-sm">{record.content.impression}</p>
            </div>
          </div>
          {record.documents.some((doc: any) => doc.type === "image") && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-medium">Images</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {record.documents
                  .filter((doc: any) => doc.type === "image")
                  .map((doc: any) => (
                    <div
                      key={doc.id}
                      className="overflow-hidden rounded-lg border cursor-pointer"
                      onClick={() => {
                        // This would be handled by the parent component
                      }}
                    >
                      <img
                        src={doc.url || "/placeholder.svg"}
                        alt={doc.name}
                        className="h-48 w-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="p-2">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )
    case "treatments":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Treatment Plan</h3>
            {record.content.medications && record.content.medications.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-500">Medications</p>
                <div className="mt-2 space-y-2">
                  {record.content.medications.map((medication: any, index: number) => (
                    <div key={index} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{medication.name}</p>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {medication.dosage}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {medication.frequency} • {medication.duration || "Ongoing"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {record.content.lifestyle && record.content.lifestyle.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-500">Lifestyle Recommendations</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {record.content.lifestyle.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {record.content.monitoring && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-500">Monitoring</p>
                <p className="text-sm">{record.content.monitoring}</p>
              </div>
            )}
            {record.content.followUp && (
              <div>
                <p className="text-sm font-medium text-slate-500">Follow-up</p>
                <p className="text-sm">{record.content.followUp}</p>
              </div>
            )}
          </div>
        </div>
      )
    case "medications":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Current Medications</h3>
            <div className="space-y-3">
              {record.content.medications.map((medication: any, index: number) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{medication.name}</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {medication.dosage}
                    </Badge>
                  </div>
                  <div className="mt-1 space-y-1 text-sm text-slate-500">
                    <p>Frequency: {medication.frequency}</p>
                    <p>
                      Started: {new Date(medication.startDate).toLocaleDateString()}
                      {medication.endDate && ` • Ended: ${new Date(medication.endDate).toLocaleDateString()}`}
                    </p>
                    <p>Prescriber: {medication.prescriber}</p>
                    <p>
                      Pharmacy: {medication.pharmacy}
                      {medication.refills !== null && ` • Refills: ${medication.refills}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {record.content.allergies && record.content.allergies.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Allergies</h3>
              <div className="space-y-2">
                {record.content.allergies.map((allergy: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>{allergy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    case "vitals":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Vital Signs</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {record.content.readings.map((reading: any, index: number) => (
                <div key={index} className="rounded-lg border p-3">
                  <p className="text-sm text-slate-500">{reading.name}</p>
                  <p className="text-xl font-medium">
                    {reading.value} <span className="text-sm font-normal text-slate-500">{reading.unit}</span>
                  </p>
                </div>
              ))}
            </div>
            {record.content.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">Notes</p>
                <p className="text-sm">{record.content.notes}</p>
              </div>
            )}
          </div>
        </div>
      )
    case "procedures":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Procedure Details</h3>
            <div>
              <p className="text-sm font-medium text-slate-500">Procedure</p>
              <p>{record.content.procedure}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Findings</p>
              <p className="text-sm">{record.content.findings}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Interpretation</p>
              <p className="text-sm">{record.content.interpretation}</p>
            </div>
          </div>
        </div>
      )
    default:
      return <div>No details available</div>
  }
}
