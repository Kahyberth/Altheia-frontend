export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}


export interface ILoginRequest {
  email: string;
  password: string;
}


export interface VerfySession {
  isValid:  boolean;
  token:    string;
  userInfo: IUser;
}


export interface PatientDto {
  name: string;
  email: string;
  gender: string;
  phone: string;
  documentNumber: string;
  dateOfBirth: string;
  address: string;
  eps: string;
  bloodType: string;
  clinic: string;
}

export enum UserRole {
  LAB_TECHNICIAN = 'lab_technician',
  OWNER = 'owner',
  PATIENT = 'patient',
  PHYSICIAN = 'physician',
  RECEPTIONIST = 'receptionist'
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RoleConfig {
  role: UserRole;
  name: string;
  permissions: Permission[];
  navigationItems: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
  requiredPermissions?: string[];
}



