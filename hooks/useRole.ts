"use client";

import { useAuth } from '@/context/AuthContext';
import { RoleService } from '@/services/roleService';
import { NavigationItem, UserRole } from '@/types/auth';

export function useRole() {
  const { user } = useAuth();

  const userRole = user?.role as UserRole;

  return {
    user,
    role: userRole,
    roleName: user ? RoleService.getRoleName(user.role) : '',
    clinicId: user?.clinic_id,
    
    
    hasPermission: (resource: string, action: string): boolean => {
      if (!user) return false;
      return RoleService.hasPermission(user.role, resource, action);
    },
    
    canAccessRoute: (route: string): boolean => {
      if (!user) return false;
      return RoleService.canAccessRoute(user.role, route);
    },
    
    getNavigationItems: (): NavigationItem[] => {
      if (!user) return [];
      return RoleService.getNavigationItems(user.role);
    },
    
    isOwner: (): boolean => userRole === UserRole.OWNER,
    isPhysician: (): boolean => userRole === UserRole.PHYSICIAN,
    isLabTechnician: (): boolean => userRole === UserRole.LAB_TECHNICIAN,
    isPatient: (): boolean => userRole === UserRole.PATIENT,
    isReceptionist: (): boolean => userRole === UserRole.RECEPTIONIST,
    
    isAdmin: (): boolean => userRole === UserRole.OWNER,
    isDoctor: (): boolean => userRole === UserRole.PHYSICIAN,
    
    isMedicalStaff: (): boolean => 
      userRole === UserRole.PHYSICIAN || userRole === UserRole.LAB_TECHNICIAN,
    
    isAdministrativeStaff: (): boolean => 
      userRole === UserRole.OWNER || userRole === UserRole.RECEPTIONIST,
    
    isStaff: (): boolean => 
      userRole !== UserRole.PATIENT,
  };
} 