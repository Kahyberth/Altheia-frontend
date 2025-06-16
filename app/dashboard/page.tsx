"use client";
import OwnerDashboardPage from "@/components/Dashboard/Owner/page";
import PatientDashboardPage from "@/components/Dashboard/Patient/page";
import PhysicianDashboardPage from "@/components/Dashboard/Physician/page";
import ReceptionistDashboardPage from "@/components/Dashboard/Receptionist/page";
import SuperDashboard from "@/components/Dashboard/Super/page";
import { useAuth } from "@/context/AuthContext";
import { OwnerOnly, PatientOnly, PhysicianOnly, ReceptionistOnly, SuperAdminOnly } from "@/guard/RoleGuard";


export default function DashboardPage() {

  const { user } = useAuth();


  console.log(user?.role);

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

      <SuperAdminOnly>
        <SuperDashboard />
      </SuperAdminOnly>
    </div>
  )
}