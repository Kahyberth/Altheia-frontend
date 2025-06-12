"use client"

import { motion } from "framer-motion"
import { Building2 } from "lucide-react"

export default function ClinicManagementLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
          <Building2 className="absolute inset-0 m-auto text-white h-6 w-6" />
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 150 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
          className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
        />
        <p className="mt-4 text-sm text-slate-600">Cargando gestión de clínica...</p>
      </motion.div>
    </div>
  )
}
