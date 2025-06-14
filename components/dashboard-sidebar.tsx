"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";
import { iconMap } from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { user, roleName, getNavigationItems } = useRole();
  const { logout } = useAuth();
  const router = useRouter();

  const navigationItems = getNavigationItems();

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
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-white dark:bg-slate-900 dark:border-slate-800 md:relative md:z-0",
          open ? "shadow-lg md:shadow-none" : ""
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
              <Shield className="absolute inset-0 m-auto text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              Altheia
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Cerrar menú</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navigationItems.map((item) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800",
                    activeItem === item.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                  onClick={() => setActiveItem(item.id)}
                >
                  {IconComponent && (
                    <IconComponent
                      className={cn(
                        "h-5 w-5",
                        activeItem === item.id
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                      )}
                    />
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 text-xs font-medium text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium dark:text-white">
                {user?.name || "Usuario"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {roleName}
              </p>
              <Badge
                variant="outline"
                className="mt-1 bg-green-50 text-green-700 border-green-200"
              >
                Active Member
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Menú de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await logout();
                      router.push("/");
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </>
  );
}
