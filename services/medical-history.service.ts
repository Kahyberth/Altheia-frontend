import apiClient from "@/fetch/apiClient";

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: string;
  title: string;
  date: string;
  provider: string;
  status: string;
  content: {
    allergies?: string;
    consult_reason?: string;
    description?: string;
    family_info?: string;
    notes?: string;
    observations?: string;
    personal_info?: string;
    medications?: Array<{
      dosage: string;
      duration: string;
      frequency: string;
      instructions: string;
      name: string;
      prescriber: string;
      startDate: string;
    }>;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
  };
  documents: any[];
}

export interface PatientMedicalInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  mrn: string;
  avatar: string;
}

export interface MedicalHistoryResponse {
  success: boolean;
  data: {
    patients: PatientMedicalInfo[];
    medicalRecords: MedicalRecord[];
    metadata: {
      totalRecords: number;
      totalPatients: number;
      lastUpdated: string;
      version: string;
    };
  };
}

export interface PatientMedicalHistory {
  patient: PatientMedicalInfo;
  medicalRecords: MedicalRecord[];
  lastUpdate: string;
  recordCount: number;
}

export interface ClinicMedicalHistoryResponse {
  success: boolean;
  data: PatientMedicalHistory[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  summary: {
    totalPatients: number;
    totalMedicalRecords: number;
    recentActivity: string;
    mostActivePatient: string;
    lastUpdated: string;
  };
}

export const medicalHistoryService = {
  getPatientMedicalHistory: async (patientId: string): Promise<MedicalHistoryResponse> => {
    try {
      const response = await apiClient.get(`/medical-history/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient medical history:', error);
      throw error;
    }
  },

  getAllPatientsHistory: async (): Promise<MedicalHistoryResponse> => {
    try {
      const response = await apiClient.get('/medical-history/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all patients medical history:', error);
      throw error;
    }
  },

  getClinicMedicalHistory: async (clinicId: string, page: number = 1, size: number = 20): Promise<ClinicMedicalHistoryResponse> => {
    try {
      const response = await apiClient.get(`/medical-history/clinic/${clinicId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clinic medical history:', error);
      throw error;
    }
  }
}; 