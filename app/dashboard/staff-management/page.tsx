"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  UserCheck,
  Stethoscope,
  ClipboardList,
  FlaskRoundIcon as Flask,
  Menu,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import StaffManagementLoading from "./loading"
import { useAuth } from "@/context/AuthContext"
import { getClinicInformation, getPersonnelInClinic } from "@/services/clinic.service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StaffTable } from "@/components/staff-table"
import { AddStaffDialog } from "@/components/add-staff-dialog"
import { StaffDetailsDialog } from "@/components/staff-details-dialog"
import { useMobile } from "@/hooks/use-mobile"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

const FullPageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
        <Users className="absolute inset-0 m-auto text-white h-6 w-6" />
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 150 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
        className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
      />
      <p className="mt-4 text-sm text-slate-600">Cargando personal...</p>
    </motion.div>
  </div>
)

export default function StaffManagementPage() {
  const isMobile = useMobile()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [selectedStaffType, setSelectedStaffType] = useState("physician")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staffList, setStaffList] = useState<any[]>([])

  const handleOpenAddStaff = (type: string) => {
    setSelectedStaffType(type)
    setIsAddStaffOpen(true)
  }

  const handleViewDetails = (staff: any) => {
    setSelectedStaff(staff)
    setIsDetailsOpen(true)
  }

  // Fetch staff from backend
  useEffect(() => {
    const fetchStaff = async () => {
      if (!user?.id) return
      try {
        const clinicRes = await getClinicInformation(user.id)
        const clinicId = clinicRes.data?.clinic?.id || clinicRes.data?.information?.clinic_id
        if (!clinicId) throw new Error("No clinic id found")
        const personnelRes = await getPersonnelInClinic(clinicId)
        const formatted = (personnelRes.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          role: p.rol,
          email: p.email,
          phone: p.phone,
          status: p.status ? "active" : "inactive",
        }))
        setStaffList(formatted)
      } catch (err) {
        console.error("Error fetching personnel:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStaff()
  }, [user])

  const roleIcons = {
    physician: <Stethoscope className="h-4 w-4" />,
    receptionist: <ClipboardList className="h-4 w-4" />,
    laboratory: <Flask className="h-4 w-4" />,
    patient: <UserCheck className="h-4 w-4" />,
  }

  const roleColors = {
    physician: "bg-blue-100 text-blue-800",
    receptionist: "bg-purple-100 text-purple-800",
    laboratory: "bg-green-100 text-green-800",
    patient: "bg-amber-100 text-amber-800",
  }

  const statusColors = {
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-slate-100 text-slate-800",
    on_leave: "bg-amber-100 text-amber-800",
    registered: "bg-cyan-100 text-cyan-800",
  }

  const getFilteredStaff = () => {
    let allStaff = [...staffList]

    if (selectedRole !== "all") {
      allStaff = allStaff.filter((staff) => staff.role === selectedRole)
    }

    if (searchQuery) {
      allStaff = allStaff.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return allStaff
  }

  const filteredStaff = getFilteredStaff()

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

  const statsData = [
    { title: "Total Staff", value: staffList.length, icon: <Users className="h-4 w-4" /> },
    { title: "Physicians", value: staffList.filter((s) => s.role === "physician").length, icon: <Stethoscope className="h-4 w-4" /> },
    { title: "Receptionists", value: staffList.filter((s) => s.role === "receptionist").length, icon: <ClipboardList className="h-4 w-4" /> },
    { title: "Laboratory", value: staffList.filter((s) => s.role === "laboratory").length, icon: <Flask className="h-4 w-4" /> },
    { title: "Patients", value: staffList.filter((s) => s.role === "patient").length, icon: <UserCheck className="h-4 w-4" /> },
  ]

  if (isLoading) {
    return <FullPageLoader />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <motion.div
        className="flex-1 overflow-auto py-6 px-4 md:px-6 space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header with toggle */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Personal</h1>
          </div>
          <Button onClick={() => handleOpenAddStaff("physician")} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white gap-2">
            <UserPlus className="h-4 w-4" /> Añadir Personal
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsData.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="physician">Médicos</SelectItem>
                <SelectItem value="receptionist">Recepcionistas</SelectItem>
                <SelectItem value="laboratory">Laboratorio</SelectItem>
                <SelectItem value="patient">Pacientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Personal de la Clínica</CardTitle>
              <CardDescription>{filteredStaff.length} miembros encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffTable
                data={filteredStaff}
                roleIcons={roleIcons}
                roleColors={roleColors}
                statusColors={statusColors}
                onViewDetails={handleViewDetails}
                loading={isLoading}
              />
            </CardContent>
          </Card>
        </motion.div>

        <AddStaffDialog
          open={isAddStaffOpen}
          onOpenChange={setIsAddStaffOpen}
          staffType={selectedStaffType}
          onStaffTypeChange={setSelectedStaffType}
        />

        {selectedStaff && (
          <StaffDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            staff={selectedStaff}
            roleIcons={roleIcons}
            roleColors={roleColors}
            statusColors={statusColors}
          />
        )}
      </motion.div>
    </div>
  )
}
