import { UserRole, RoleConfig, NavigationItem } from '@/types/auth';


const roleConfigurations: Record<UserRole, RoleConfig> = {
  [UserRole.SUPER_ADMIN]: {
    role: UserRole.SUPER_ADMIN,
    name: 'Super Administrador',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'activate', 'deactivate'] },
      { resource: 'patients', actions: ['create', 'read', 'update', 'delete', 'activate', 'deactivate'] },
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'clinic', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'staff', actions: ['create', 'read', 'update', 'delete', 'activate', 'deactivate'] },
      { resource: 'system', actions: ['read', 'update', 'delete', 'manage'] },
      { resource: 'super-admin', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'clinic-owners', actions: ['read', 'update', 'activate', 'deactivate'] },
      { resource: 'deactivated-users', actions: ['read', 'activate', 'delete'] },
      { resource: 'records', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'prescriptions', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'lab_orders', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'lab_results', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'equipment', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'medical_records', actions: ['create', 'read', 'update', 'delete'] }
    ],
    navigationItems: [
      { id: 'super-dashboard', label: 'Super Dashboard', icon: 'Crown', href: '/dashboard/super' },
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'users', label: 'Gestión de Personal', icon: 'Users', href: '/dashboard/staff-management' },
      { id: 'patients', label: 'Pacientes', icon: 'User', href: '/dashboard/patients' },
      { id: 'appointments', label: 'Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'analytics', label: 'Analíticas', icon: 'BarChart3', href: '/dashboard/analytics' },
      { id: 'clinic', label: 'Gestión Clínica', icon: 'Shield', href: '/dashboard/clinic-management' },
      { id: 'lab-orders', label: 'Órdenes de Laboratorio', icon: 'ClipboardCheck', href: '/dashboard/lab-orders' },
      { id: 'lab-results', label: 'Resultados', icon: 'Activity', href: '/dashboard/lab-results' },
      { id: 'equipment', label: 'Equipos', icon: 'Settings', href: '/dashboard/equipment' },
      { id: 'medical-records', label: 'Historial Médico', icon: 'FileText', href: '/dashboard/medical-records' },
      { id: 'profile', label: 'Mi Perfil', icon: 'User', href: '/dashboard/profile' }
    ]
  },

  [UserRole.OWNER]: {
    role: UserRole.OWNER,
    name: 'Creador de la Clínica',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'patients', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'clinic', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'staff', actions: ['create', 'read', 'update', 'delete'] }
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'users', label: 'Gestión de Personal', icon: 'Users', href: '/dashboard/staff-management' },
      { id: 'patients', label: 'Pacientes', icon: 'User', href: '/dashboard/patients' },
      { id: 'appointments', label: 'Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'analytics', label: 'Analíticas', icon: 'BarChart3', href: '/dashboard/analytics' },
      { id: 'clinic', label: 'Gestión Clínica', icon: 'Shield', href: '/dashboard/clinic-management' },
    ]
  },
  
  [UserRole.PHYSICIAN]: {
    role: UserRole.PHYSICIAN,
    name: 'Doctor',
    permissions: [
      { resource: 'patients', actions: ['create', 'read', 'update'] },
      { resource: 'appointments', actions: ['read', 'update'] },
      { resource: 'records', actions: ['create', 'read', 'update'] },
      { resource: 'prescriptions', actions: ['create', 'read', 'update'] },
      { resource: 'lab_orders', actions: ['create', 'read'] }
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'patients', label: 'Pacientes', icon: 'Users', href: '/dashboard/patients' },
      { id: 'appointments', label: 'Mis Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'profile', label: 'Mi Perfil', icon: 'User', href: '/dashboard/profile' },
      { id: 'medical-records', label: 'Historial Médico', icon: 'FileText', href: '/dashboard/medical-records' }
    ]
  },
  
  [UserRole.LAB_TECHNICIAN]: {
    role: UserRole.LAB_TECHNICIAN,
    name: 'Personal de Laboratorio',
    permissions: [
      { resource: 'lab_results', actions: ['create', 'read', 'update'] },
      { resource: 'lab_orders', actions: ['read', 'update'] },
      { resource: 'patients', actions: ['read'] }
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'lab-orders', label: 'Órdenes de Laboratorio', icon: 'ClipboardCheck', href: '/dashboard/lab-orders' },
      { id: 'lab-results', label: 'Resultados', icon: 'Activity', href: '/dashboard/lab-results' },
      { id: 'patients', label: 'Pacientes', icon: 'Users', href: '/dashboard/patients' },
      { id: 'equipment', label: 'Equipos', icon: 'Settings', href: '/dashboard/equipment' }
    ]
  },
  
  [UserRole.PATIENT]: {
    role: UserRole.PATIENT,
    name: 'Paciente',
    permissions: [
      { resource: 'appointments', actions: ['create', 'read'] },
      { resource: 'records', actions: ['read'] },
      { resource: 'profile', actions: ['read', 'update'] }
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Mi Panel', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'appointments', label: 'Mis Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'records', label: 'Historial Clínico', icon: 'FileText', href: '/dashboard/patient-history' },
      { id: 'profile', label: 'Mi Perfil', icon: 'User', href: '/dashboard/profile' }
    ]
  },
  
  [UserRole.RECEPTIONIST]: {
    role: UserRole.RECEPTIONIST,
    name: 'Recepcionista',
    permissions: [
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'patients', actions: ['create', 'read', 'update'] },
      { resource: 'records', actions: ['create', 'read', 'update'] },
      { resource: 'medical_records', actions: ['create', 'read', 'update'] },
      { resource: 'clinic', actions: ['read'] },
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'appointments', label: 'Gestión de Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'patients', label: 'Registro de Pacientes', icon: 'Users', href: '/dashboard/patients' },
      { id: 'medical-records', label: 'Historial Médico', icon: 'FileText', href: '/dashboard/medical-records' },
      { id: 'profile', label: 'Mi Perfil', icon: 'User', href: '/dashboard/profile' },
    ]
  }
};




export class RoleService {
  /**
   * Obtiene la configuración completa de un rol
   */
  static getRoleConfig(role: string): RoleConfig | null {
    const userRole = role as UserRole;
    return roleConfigurations[userRole] || null;
  }

  /**
   * Obtiene los elementos de navegación para un rol específico
   */
  static getNavigationItems(role: string): NavigationItem[] {
    const config = this.getRoleConfig(role);
    return config?.navigationItems || [];
  }

  /**
   * Verifica si un usuario tiene permisos para realizar una acción en un recurso
   */
  static hasPermission(role: string, resource: string, action: string): boolean {
    const config = this.getRoleConfig(role);
    if (!config) return false;

    const permission = config.permissions.find(p => p.resource === resource);
    return permission?.actions.includes(action) || false;
  }

  /**
   * Verifica si un usuario puede acceder a una ruta específica
   */
  static canAccessRoute(role: string, route: string): boolean {
    const navigationItems = this.getNavigationItems(role);
    return navigationItems.some(item => route.startsWith(item.href));
  }

  /**
   * Obtiene el nombre del rol en español
   */
  static getRoleName(role: string): string {
    const config = this.getRoleConfig(role);
    return config?.name || 'Usuario';
  }

  /**
   * Filtra elementos de navegación basados en permisos
   */
  static filterNavigationByPermissions(role: string, items: NavigationItem[]): NavigationItem[] {
    return items.filter(item => {
      if (!item.requiredPermissions) return true;
      
      return item.requiredPermissions.every(permission => {
        const [resource, action] = permission.split(':');
        return this.hasPermission(role, resource, action);
      });
    });
  }
} 