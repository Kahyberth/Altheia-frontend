"use client";

import { ReactNode } from "react";
import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles?: UserRole[];
  requiredPermissions?: { resource: string; action: string }[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGuard({ 
  allowedRoles = [], 
  requiredPermissions = [], 
  fallback = null, 
  children 
}: RoleGuardProps) {
  const { role, hasPermission } = useRole();


  if (allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <>{fallback}</>;
    }
  }


  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(
      permission => hasPermission(permission.resource, permission.action)
    );
    
    if (!hasAllPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}


export function OwnerOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.OWNER]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function PhysicianOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.PHYSICIAN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function LabTechnicianOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.LAB_TECHNICIAN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function PatientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.PATIENT]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ReceptionistOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.RECEPTIONIST]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function MedicalStaffOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.PHYSICIAN, UserRole.LAB_TECHNICIAN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function StaffOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.OWNER, UserRole.PHYSICIAN, UserRole.LAB_TECHNICIAN, UserRole.RECEPTIONIST]} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export const AdminOnly = OwnerOnly;
export const DoctorOnly = PhysicianOnly; 