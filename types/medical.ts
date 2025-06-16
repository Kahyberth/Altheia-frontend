export interface MedicalHistoryInPatient {
  data: Data;
  success: boolean;
}

export interface Data {
  id: string;
  patient_id: string;
  patient_name: string;
  consult_reason: string;
  personal_info: string;
  family_info: string;
  allergies: string;
  observations: string;
  last_update: Date;
  created_at: Date;
  updated_at: Date;
  consultations: Consultation[];
  total_consultations: number;
}

export interface Consultation {
  id: string;
  medical_history_id: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  physician_info: PhysicianInfo;
  metadata: Metadata;
  prescriptions: Prescription[];
}

export interface Metadata {
  created_at: Date;
  updated_at: Date;
  consult_date: Date;
}

export interface PhysicianInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  document_number: string;
  physician_specialty: string;
  license_number: string;
  gender: string;
}

export interface Prescription {
  id: string;
  consultation_id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  issued_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalConsultation {
  patient_id: string;
  physician_id: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  update_medical_history: boolean;
  consult_reason: string;
  personal_info: string;
  family_info: string;
  allergies: string;
  observations: string;
  prescriptions: Prescription[];
}
