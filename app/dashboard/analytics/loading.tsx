import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"

export default function AnalyticsLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
          <BarChart3 className="absolute inset-0 m-auto text-white h-6 w-6" />
        </div>
        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-slate-200">
          <Skeleton className="h-full w-full" />
        </div>
        <p className="mt-4 text-sm text-slate-600">Loading analytics data...</p>
      </div>
    </div>
  )
}
