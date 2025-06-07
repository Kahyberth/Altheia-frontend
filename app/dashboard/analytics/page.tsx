"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Filter,
  Download,
  Save,
  BarChart3,
  ChevronDown,
  Plus,
  RefreshCw,
  Clock,
  Users,
  Activity,
  TrendingUp,
  Clipboard,
  Sliders,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { PatientDemographicsChart } from "@/components/patient-demographics-chart"
import { TreatmentOutcomesChart } from "@/components/treatment-outcomes-chart"
import { OperationalMetricsChart } from "@/components/operational-metrics-chart"
import { RevenueAnalyticsChart } from "@/components/revenue-analytics-chart"
import { DiagnosisDistributionChart } from "@/components/diagnosis-distribution-chart"
import { ProviderPerformanceTable } from "@/components/provider-performance-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { SavedReportsList } from "@/components/saved-reports-list"
import { ReportExportDialog } from "@/components/report-export-dialog"

export default function AnalyticsPage() {
  const isMobile = useMobile()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [activeTab, setActiveTab] = useState("overview")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
            <BarChart3 className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600">Loading analytics data...</p>
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
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search reports, metrics, or patients..."
                className="w-full bg-slate-50 pl-8 focus-visible:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowExportDialog(true)}>
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="default" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Save Report</span>
            </Button>
          </div>
        </header>

        {/* Analytics Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="show" variants={container} className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <motion.div variants={item} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Analytics & Reporting</h1>
                  <p className="text-sm text-slate-500">Gain insights from your healthcare data</p>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filters</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <DropdownMenuLabel>Filter Analytics</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Patient Demographics</label>
                          <Select defaultValue="all">
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="All Demographics" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Demographics</SelectItem>
                              <SelectItem value="age">Age Groups</SelectItem>
                              <SelectItem value="gender">Gender</SelectItem>
                              <SelectItem value="location">Location</SelectItem>
                              <SelectItem value="insurance">Insurance Type</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Diagnosis</label>
                          <Select defaultValue="all">
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="All Diagnoses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Diagnoses</SelectItem>
                              <SelectItem value="cardiac">Cardiac</SelectItem>
                              <SelectItem value="respiratory">Respiratory</SelectItem>
                              <SelectItem value="neurological">Neurological</SelectItem>
                              <SelectItem value="orthopedic">Orthopedic</SelectItem>
                              <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Provider</label>
                          <Select defaultValue="all">
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="All Providers" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Providers</SelectItem>
                              <SelectItem value="dr-taylor">Dr. Taylor</SelectItem>
                              <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                              <SelectItem value="dr-patel">Dr. Patel</SelectItem>
                              <SelectItem value="dr-garcia">Dr. Garcia</SelectItem>
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
                </div>
              </div>
            </motion.div>

            {/* Analytics Tabs */}
            <motion.div variants={item}>
              <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
                <div className="overflow-auto">
                  <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 w-auto">
                    <TabsTrigger
                      value="overview"
                      className="rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="patients"
                      className="rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
                    >
                      Patient Analytics
                    </TabsTrigger>
                    <TabsTrigger
                      value="clinical"
                      className="rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
                    >
                      Clinical Outcomes
                    </TabsTrigger>
                    <TabsTrigger
                      value="operational"
                      className="rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
                    >
                      Operational
                    </TabsTrigger>
                    <TabsTrigger
                      value="financial"
                      className="rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
                    >
                      Financial
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
                    >
                      Saved Reports
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        title: "Total Patients",
                        value: "1,284",
                        change: "+4.6%",
                        changeType: "positive",
                        icon: Users,
                        color: "bg-blue-50 text-blue-600",
                      },
                      {
                        title: "Avg. Treatment Success",
                        value: "87.3%",
                        change: "+2.1%",
                        changeType: "positive",
                        icon: Activity,
                        color: "bg-green-50 text-green-600",
                      },
                      {
                        title: "Avg. Wait Time",
                        value: "14 min",
                        change: "-5.2%",
                        changeType: "positive",
                        icon: Clock,
                        color: "bg-cyan-50 text-cyan-600",
                      },
                      {
                        title: "Revenue Trend",
                        value: "$128.5k",
                        change: "+8.4%",
                        changeType: "positive",
                        icon: TrendingUp,
                        color: "bg-amber-50 text-amber-600",
                      },
                    ].map((card, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className={`rounded-full ${card.color} p-2`}>
                                <card.icon className="h-5 w-5" />
                              </div>
                              <Badge
                                variant={card.changeType === "positive" ? "outline" : "destructive"}
                                className={
                                  card.changeType === "positive"
                                    ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
                                    : ""
                                }
                              >
                                {card.change}
                              </Badge>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-medium text-slate-500">{card.title}</p>
                              <h3 className="mt-1 text-2xl font-bold">{card.value}</h3>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="grid gap-6 lg:grid-cols-7">
                    {/* Left Column - 4/7 width */}
                    <div className="space-y-6 lg:col-span-4">
                      {/* Patient Demographics */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle>Patient Demographics</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1">
                                  <Sliders className="h-3.5 w-3.5" />
                                  <span>Options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View by Age</DropdownMenuItem>
                                <DropdownMenuItem>View by Gender</DropdownMenuItem>
                                <DropdownMenuItem>View by Location</DropdownMenuItem>
                                <DropdownMenuItem>View by Insurance</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Download Chart</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardDescription>Distribution of patient population by key demographics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <PatientDemographicsChart />
                        </CardContent>
                      </Card>

                      {/* Treatment Outcomes */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle>Treatment Outcomes</CardTitle>
                            <Select defaultValue="6months">
                              <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30days">Last 30 Days</SelectItem>
                                <SelectItem value="3months">Last 3 Months</SelectItem>
                                <SelectItem value="6months">Last 6 Months</SelectItem>
                                <SelectItem value="1year">Last Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <CardDescription>Success rates across different treatment categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <TreatmentOutcomesChart />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - 3/7 width */}
                    <div className="space-y-6 lg:col-span-3">
                      {/* Diagnosis Distribution */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle>Diagnosis Distribution</CardTitle>
                          <CardDescription>Top diagnoses by percentage</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <DiagnosisDistributionChart />
                        </CardContent>
                      </Card>

                      {/* Provider Performance */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle>Provider Performance</CardTitle>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-600">
                              <span>View All</span>
                            </Button>
                          </div>
                          <CardDescription>Key metrics by healthcare provider</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ProviderPerformanceTable />
                        </CardContent>
                      </Card>

                      {/* Quick Reports */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle>Quick Reports</CardTitle>
                          <CardDescription>Frequently accessed reports</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                          {[
                            { title: "Patient Satisfaction", icon: Users, color: "bg-blue-50 text-blue-600" },
                            { title: "Readmission Rates", icon: RefreshCw, color: "bg-cyan-50 text-cyan-600" },
                            { title: "Medication Adherence", icon: Clipboard, color: "bg-amber-50 text-amber-600" },
                            { title: "Appointment Analytics", icon: Calendar, color: "bg-green-50 text-green-600" },
                          ].map((report, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              className="h-auto flex-col gap-2 p-4 justify-start items-center hover:bg-slate-50"
                            >
                              <div className={`rounded-full ${report.color} p-2`}>
                                <report.icon className="h-5 w-5" />
                              </div>
                              <span className="text-xs font-medium">{report.title}</span>
                            </Button>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Patient Analytics Tab */}
                <TabsContent value="patients" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Demographics & Trends</CardTitle>
                      <CardDescription>Comprehensive analysis of patient population and trends</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Age Distribution</h3>
                        <div className="h-[300px]">
                          <PatientDemographicsChart />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Patient Growth Trend</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for patient growth chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Patient growth trend visualization</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Geographic Distribution</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for geographic distribution chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Geographic distribution visualization</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Clinical Outcomes Tab */}
                <TabsContent value="clinical" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Clinical Outcomes Analysis</CardTitle>
                      <CardDescription>
                        Detailed analysis of treatment effectiveness and patient outcomes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Treatment Success Rates</h3>
                        <div className="h-[300px]">
                          <TreatmentOutcomesChart />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Readmission Rates</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for readmission rates chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Readmission rates visualization</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Medication Effectiveness</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for medication effectiveness chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Medication effectiveness visualization</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Operational Tab */}
                <TabsContent value="operational" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Operational Metrics</CardTitle>
                      <CardDescription>Analysis of operational efficiency and resource utilization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Appointment Metrics</h3>
                        <div className="h-[300px]">
                          <OperationalMetricsChart />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Resource Utilization</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for resource utilization chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Resource utilization visualization</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Staff Productivity</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for staff productivity chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Staff productivity visualization</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financial Tab */}
                <TabsContent value="financial" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Analytics</CardTitle>
                      <CardDescription>Comprehensive analysis of revenue, costs, and financial trends</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Revenue Trends</h3>
                        <div className="h-[300px]">
                          <RevenueAnalyticsChart />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Insurance Reimbursement</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for insurance reimbursement chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Insurance reimbursement visualization</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Cost Analysis</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for cost analysis chart */}
                          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm text-slate-500">Cost analysis visualization</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Saved Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Saved Reports</CardTitle>
                        <Button size="sm" className="gap-1.5">
                          <Plus className="h-3.5 w-3.5" />
                          <span>New Report</span>
                        </Button>
                      </div>
                      <CardDescription>Access and manage your saved analytics reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SavedReportsList />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Export Dialog */}
      {showExportDialog && <ReportExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />}
    </div>
  )
}

function Menu({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
