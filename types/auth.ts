export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  clinic_id?: string;
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
  password: string;
  gender: string;
  phone: string;
  document_number: string;
  date_of_birth: string;
  address: string;
  eps: string;
  blood_type: string;
  clinic_id?: string;
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


export interface IUpdatePatientRequest {
  name?: string;
  phone?: string;
  eps?: string;
  address?: string;
  password?: string;
}

export interface IUpdatePhysicianRequest {
  name?: string;
  phone?: string;
  physician_specialty?: string;
  password?: string;
}

export interface IUpdateReceptionistRequest {
  name?: string;
  phone?: string;
  password?: string;
}

export interface IUpdateLabTechnicianRequest {
  name?: string;
  phone?: string;
  password?: string;
}

export interface IUpdateOwnerRequest {
  name?: string;
  phone?: string;
  password?: string;
}


