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
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

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
      laboratory: "Laboratorio",
      patient: "Paciente",
    }
    return roleMap[role] || role
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, idx) => (
              <TableRow key={idx}>
                <TableCell className="w-[250px]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-6 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <AnimatePresence>
              {data.map((staff) => (
                <motion.tr
                  key={staff.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredRow(staff.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`${hoveredRow === staff.id ? "bg-slate-50" : ""} relative`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(staff.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        {staff.specialty && <p className="text-xs text-muted-foreground">{staff.specialty}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${roleColors[staff.role]} flex w-fit items-center gap-1`}>
                      {roleIcons[staff.role]}
                      {getRoleLabel(staff.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{staff.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{staff.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[staff.status]}>
                      {getStatusLabel(staff.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(staff)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {staff.status === "active" ? (
                          <DropdownMenuItem className="text-amber-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-600">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
          {data.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
