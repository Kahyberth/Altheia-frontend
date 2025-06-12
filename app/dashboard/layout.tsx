import ProtectedRoute from "@/guard/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
} 