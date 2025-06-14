import OwnerDashboardPage from "@/components/Dashboard/Owner/page";
import PatientDashboardPage from "@/components/Dashboard/Patient/page";
import { OwnerOnly, PatientOnly } from "@/guard/RoleGuard";






export default function DashboardPage() {
  return (
    <div>
      <PatientOnly>
        <PatientDashboardPage />
      </PatientOnly>
      <OwnerOnly>
        <OwnerDashboardPage />
      </OwnerOnly>
    </div>
  )
}