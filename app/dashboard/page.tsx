import OwnerDashboardPage from "@/components/Dashboard/Owner/page";
import PatientDashboardPage from "@/components/Dashboard/Patient/page";
import PhysicianDashboardPage from "@/components/Dashboard/Physician/page";
import ReceptionistDashboardPage from "@/components/Dashboard/Receptionist/page";
import { OwnerOnly, PatientOnly, PhysicianOnly, ReceptionistOnly } from "@/guard/RoleGuard";

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
      <PhysicianOnly>
        <PhysicianDashboardPage />
      </PhysicianOnly>
    </div>
  )
}