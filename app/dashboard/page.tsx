import OwnerDashboardPage from "@/components/Dashboard/Owner/page";
import PatientDashboardPage from "@/components/Dashboard/Patient/page";
import ReceptionistDashboardPage from "@/components/Dashboard/Receptionist/page";
import { OwnerOnly, PatientOnly, ReceptionistOnly } from "@/guard/RoleGuard";

export default function DashboardPage() {
  return (
    <div>
      <PatientOnly>
        <PatientDashboardPage />
      </PatientOnly>
      <OwnerOnly>
        <OwnerDashboardPage />
      </OwnerOnly>
      <ReceptionistOnly>
        <ReceptionistDashboardPage />
      </ReceptionistOnly>
    </div>
  )
}