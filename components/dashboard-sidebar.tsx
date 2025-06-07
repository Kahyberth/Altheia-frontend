"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  Bell,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard")

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: open ? 280 : 0,
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-white md:relative md:z-0",
          open ? "shadow-lg md:shadow-none" : "",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
              <Shield className="absolute inset-0 m-auto text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-900">MediSync</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)}>
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
              { id: "patients", label: "Patients", icon: Users, href: "/dashboard/patients" },
              { id: "appointments", label: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
              { id: "records", label: "Medical Records", icon: FileText, href: "/dashboard/records" },
              { id: "messages", label: "Messages", icon: MessageSquare, href: "/dashboard/messages", badge: "4" },
              { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
              { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/notifications", badge: "3" },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100",
                  activeItem === item.id ? "bg-blue-50 text-blue-700" : "text-slate-700",
                )}
                onClick={() => setActiveItem(item.id)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    activeItem === item.id ? "text-blue-700" : "text-slate-400 group-hover:text-slate-700",
                  )}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 text-xs font-medium text-blue-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-6 px-3">
            <p className="px-4 text-xs font-medium uppercase text-slate-400">Settings</p>
            <nav className="mt-2 grid gap-1">
              {[
                { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
                { id: "help", label: "Help & Support", icon: HelpCircle, href: "/dashboard/help" },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100",
                    activeItem === item.id ? "bg-blue-50 text-blue-700" : "text-slate-700",
                  )}
                  onClick={() => setActiveItem(item.id)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      activeItem === item.id ? "text-blue-700" : "text-slate-400 group-hover:text-slate-700",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
              <img
                src="/placeholder.svg?height=40&width=40&text=RT"
                alt="Dr. Rebecca Taylor"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium">Dr. Rebecca Taylor</p>
              <p className="truncate text-xs text-slate-500">Cardiologist</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
