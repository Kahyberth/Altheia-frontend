import apiClient from "@/fetch/apiClient"
import { MedicalConsultation, MedicalHistoryInPatient } from "@/types/medical"
import { MedicalHistoryResponse } from "./medical-history.service"

export const getMedicalHistoryByPatientId = async (patientId: string) => {
  return await apiClient.get<MedicalHistoryResponse>(`/medical-history/patient/${patientId}`)
}

export const addMedicalHistory = async (medicalHistory: MedicalConsultation ) => {
  return await apiClient.post<MedicalHistoryInPatient>("/medical-history/consultation/create", medicalHistory)
}





