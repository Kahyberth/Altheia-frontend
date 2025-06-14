"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, MoreHorizontal, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"

interface StaffTableProps {
  data: any[]
  roleIcons: Record<string, React.ReactNode>
  roleColors: Record<string, string>
  statusColors: Record<string, string>
  onViewDetails: (staff: any) => void
  loading?: boolean
}

export function StaffTable({ data, roleIcons, roleColors, statusColors, onViewDetails, loading = false }: StaffTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Activo",
      inactive: "Inactivo",
      on_leave: "De permiso",
      registered: "Registrado",
    }
    return statusMap[status] || status
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      physician: "Médico",
      receptionist: "Recepcionista",
      lab_technician: "Laboratorio",
      patient: "Paciente",
    }
    return roleMap[role] || role
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-2"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando personal...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 dark:text-slate-400">No se encontró personal</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Agrega miembros del personal para comenzar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-slate-700">
            <TableHead className="dark:text-slate-300">Personal</TableHead>
            <TableHead className="dark:text-slate-300">Rol</TableHead>
            <TableHead className="dark:text-slate-300">Contacto</TableHead>
            <TableHead className="dark:text-slate-300">Estado</TableHead>
            <TableHead className="text-right dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => (
            <TableRow key={staff.id} className="dark:border-slate-700 dark:hover:bg-slate-800">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${staff.name.charAt(0)}`} />
                    <AvatarFallback className="dark:bg-slate-700 dark:text-slate-300">{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">{staff.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{staff.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${roleColors[staff.role as keyof typeof roleColors]} border-0`}>
                  <span className="mr-1">{roleIcons[staff.role as keyof typeof roleIcons]}</span>
                  {getRoleLabel(staff.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm dark:text-slate-300">{staff.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[staff.status as keyof typeof statusColors]}>
                  {getStatusLabel(staff.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 dark:hover:bg-slate-700">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-slate-800 dark:border-slate-700">
                    <DropdownMenuLabel className="dark:text-white">Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(staff)} className="dark:text-slate-300 dark:hover:bg-slate-700">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-slate-300 dark:hover:bg-slate-700">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:border-slate-600" />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:hover:bg-slate-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
