export interface Services {
    id:   string;
    name: string;
}


export interface EPS {
    id:   string;
    name: string;
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

