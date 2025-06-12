import { UserRole, RoleConfig, NavigationItem } from '@/types/auth';


const roleConfigurations: Record<UserRole, RoleConfig> = {
  [UserRole.OWNER]: {
    role: UserRole.OWNER,
    name: 'Creador de la Clínica',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'patients', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'records', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'clinic', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'staff', actions: ['create', 'read', 'update', 'delete'] }
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'users', label: 'Gestión de Personal', icon: 'Users', href: '/dashboard/staff-management' },
      { id: 'patients', label: 'Pacientes', icon: 'User', href: '/dashboard/patients' },
      { id: 'appointments', label: 'Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'records', label: 'Historiales', icon: 'FileText', href: '/dashboard/records' },
      { id: 'analytics', label: 'Analíticas', icon: 'BarChart3', href: '/dashboard/analytics' },
      { id: 'settings', label: 'Configuración', icon: 'Settings', href: '/dashboard/settings' },
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
      { id: 'patients', label: 'Mis Pacientes', icon: 'Users', href: '/dashboard/patients' },
      { id: 'appointments', label: 'Mis Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'records', label: 'Historiales Médicos', icon: 'FileText', href: '/dashboard/records' },
      { id: 'prescriptions', label: 'Recetas', icon: 'Pill', href: '/dashboard/prescriptions' },
      { id: 'lab-orders', label: 'Órdenes de Lab', icon: 'ClipboardCheck', href: '/dashboard/lab-orders' },
      { id: 'schedule', label: 'Mi Horario', icon: 'Clock', href: '/dashboard/schedule' }
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
      { id: 'records', label: 'Mi Historial', icon: 'FileText', href: '/dashboard/records' },
      { id: 'prescriptions', label: 'Mis Recetas', icon: 'Pill', href: '/dashboard/prescriptions' },
      { id: 'profile', label: 'Mi Perfil', icon: 'User', href: '/dashboard/profile' }
    ]
  },
  
  [UserRole.RECEPTIONIST]: {
    role: UserRole.RECEPTIONIST,
    name: 'Recepcionista',
    permissions: [
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'patients', actions: ['create', 'read', 'update'] },
      { resource: 'payments', actions: ['create', 'read', 'update'] }
    ],
    navigationItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'appointments', label: 'Gestión de Citas', icon: 'Calendar', href: '/dashboard/appointments' },
      { id: 'patients', label: 'Registro de Pacientes', icon: 'Users', href: '/dashboard/patients' },
      { id: 'payments', label: 'Pagos', icon: 'CreditCard', href: '/dashboard/payments' },
      { id: 'waiting-room', label: 'Sala de Espera', icon: 'Users2', href: '/dashboard/waiting-room' }
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