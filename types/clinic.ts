export interface Services {
    id:   string;
    name: string;
}


export interface EPS {
    id:   string;
    name: string;
}

export interface PersonnelUser {
    id: string;
    name: string;
    email: string;
    password: string;
    rol: string;
    phone: string;
    document_number: string;
    status: boolean;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
    patient: Patient;
    physician: ClinicOwner;
    receptionist: ClinicOwner;
    clinic_owner: ClinicOwner;
    lab_technician: ClinicOwner;
}

export interface ClinicPhysician {
    id: string;
    user_id: string;
    user: PersonnelUser;
    physician_specialty: string;
    license_number: string;
    status: boolean;
    clinic_id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClinicReceptionist {
    id: string;
    user_id: string;
    user: PersonnelUser;
    clinic_id: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClinicPatient {
    id: string;
    user_id: string;
    user: PersonnelUser;
    name: string;
    date_of_birth: string;
    address: string;
    eps: string;
    blood_type: string;
    status: boolean;
    clinic_id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClinicInformation {
    clinic:      Clinic;
    owner:       Owner;
    information: Information;
}

export interface Clinic {
    id:                 string;
    status:             boolean;
    created_at:         Date;
    user_id:            string;
    updated_at:         Date;
    physicians:         ClinicPhysician[];
    receptionists:      ClinicReceptionist[];
    patients:           ClinicPatient[];
    clinic_information: Information;
}

export interface Information {
    clinic_id:          string;
    clinic_email:       string;
    clinic_name:        string;
    clinic_phone:       string;
    clinic_description: string;
    clinic_website:     string;
    employee_count:     number;
    "services offered": Services[];
    "eps offered":      EpsOffered[];
    address:            string;
    city:               string;
    state:              string;
    postal_code:        string;
    country:            string;
}

export interface EpsOffered {
    id:   string;
    name: string;
}

export interface Owner {
    id:              string;
    name:            string;
    email:           string;
    password:        string;
    rol:             string;
    phone:           string;
    document_number: string;
    status:          boolean;
    gender:          string;
    createdAt:       Date;
    updatedAt:       Date;
    lastLogin:       Date;
    patient:         Patient;
    physician:       ClinicOwner;
    receptionist:    ClinicOwner;
    clinic_owner:    ClinicOwner;
    lab_technician:  ClinicOwner;
}

export interface ClinicOwner {
    id:                   string;
    user_id:              string;
    clinic_id:            null | string;
    status:               boolean;
    createdAt:            Date;
    updatedAt:            Date;
    physician_specialty?: string;
    license_number?:      string;
}

export interface Patient {
    id:            string;
    user_id:       string;
    name:          string;
    date_of_birth: string;
    address:       string;
    eps:           string;
    blood_type:    string;
    status:        boolean;
    createdAt:     Date;
    updatedAt:     Date;
}

export interface ClinicEditForm {
  clinic_name: string;
  clinic_email: string;
  clinic_phone: string;
  clinic_description: string;
  clinic_website: string;
  employee_count: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  clinic_id: string;
  "services offered": Services[];
  "eps offered": EpsOffered[];
}

export interface PersonalInClinic {
    id:              string;
    name:            string;
    email:           string;
    password:        string;
    rol:             string;
    phone:           string;
    document_number: string;
    status:          boolean;
    gender:          string;
    createdAt:       Date;
    updatedAt:       Date;
    lastLogin:       Date;
}



export interface PatientByClinic {
    id:            string;
    user_id:       string;
    name:          string;
    date_of_birth: Date;
    address:       string;
    eps:           string;
    blood_type:    string;
    status:        boolean;
    clinic_id:     string;
    createdAt:     Date;
    updatedAt:     Date;
    user:          User;
}

export interface User {
    id:              string;
    name:            string;
    email:           string;
    password:        string;
    rol:             string;
    phone:           string;
    document_number: string;
    status:          boolean;
    gender:          string;
    createdAt:       Date;
    updatedAt:       Date;
    lastLogin:       Date;
}



export interface ClinicByClinicID {
    clinic:      Clinic;
    owner:       Owner;
    information: Information;
}

export interface Information {
    clinic_id:          string;
    clinic_email:       string;
    clinic_name:        string;
    clinic_phone:       string;
    clinic_description: string;
    clinic_website:     string;
    employee_count:     number;
    "services offered": SOffered[];
    "eps offered":      SOffered[];
    address:            string;
    city:               string;
    state:              string;
    postal_code:        string;
    country:            string;
}

export interface SOffered {
    id:   string;
    name: string;
}

export interface Owner {
    id:              string;
    name:            string;
    email:           string;
    password:        string;
    rol:             string;
    phone:           string;
    document_number: string;
    status:          boolean;
    gender:          string;
    createdAt:       Date;
    updatedAt:       Date;
    lastLogin:       Date;
    patient:         Patient;
    physician:       ClinicOwner;
    receptionist:    ClinicOwner;
    clinic_owner:    ClinicOwner;
    lab_technician:  ClinicOwner;
}

export interface Patient {
    id:            string;
    user_id:       string;
    user:          Owner | null;
    name:          string;
    date_of_birth: string;
    address:       string;
    eps:           string;
    blood_type:    string;
    status:        boolean;
    clinic_id:     null | string;
    createdAt:     Date;
    updatedAt:     Date;
}

export interface ClinicOwner {
    id:                   string;
    user_id:              string;
    clinic_id:            null | string;
    status:               boolean;
    createdAt:            Date;
    updatedAt:            Date;
    user?:                null;
    physician_specialty?: string;
    license_number?:      string;
}
