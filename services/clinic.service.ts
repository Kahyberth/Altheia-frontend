import { ClinicInformation, Services, EPS, PersonalInClinic, PatientByClinic, ClinicByClinicID } from "@/types/clinic"
import apiClient from "@/fetch/apiClient"

export const getClinicInformation = async (ownerId: string) => {
  return await apiClient.get<ClinicInformation>(`/clinic/by-owner/${ownerId}`)
}

export const getAllServices = async (page: number = 1, size: number = 10) => {
  return await apiClient.get<{ data: Services[]; total: number }>(`/clinic/get-services?page=${page}&size=${size}`)
}

export const getAllEps = async (page: number = 1, size: number = 10) => {
  return await apiClient.get<{ data: EPS[]; total: number }>(`/clinic/get-eps?page=${page}&size=${size}`)
}

export const updateClinicInformation = async (ownerId: string, data: any) => {
  return await apiClient.put<ClinicInformation>(`/clinic/by-owner/${ownerId}`, data)
}

export const addClinicService = async (ownerId: string, serviceId: string) => {
  return await apiClient.post<ClinicInformation>(`/clinic/by-owner/${ownerId}/services`, { serviceId })
}

export const removeClinicService = async (ownerId: string, serviceId: string) => {
  return await apiClient.delete<ClinicInformation>(`/clinic/by-owner/${ownerId}/services/${serviceId}`)
}

export const addClinicEps = async (ownerId: string, epsId: string) => {
  return await apiClient.post<ClinicInformation>(`/clinic/by-owner/${ownerId}/eps`, { epsId })
}

export const removeClinicEps = async (ownerId: string, epsId: string) => {
  return await apiClient.delete<ClinicInformation>(`/clinic/by-owner/${ownerId}/eps/${epsId}`)
}

export const assignClinicServices = async (clinicId: string, serviceIds: string[]) => {
  return await apiClient.post<ClinicInformation>(`/clinic/assign-services`, {
    clinic_id: clinicId,
    services: serviceIds,
  })
}

export const getClinicByEpsServices = async (epsId: string) => {
  return await apiClient.get<ClinicInformation>(`/clinic/by-eps/${epsId}`)
}

export const getPersonnelInClinic = async (clinicId: string) => {
  return await apiClient.get<PersonalInClinic[]>(`clinic/personnel/${clinicId}`)
}


export const getPatientsInClinic = async (clinicId: string) => {
  return await apiClient.get<PatientByClinic[]>(`clinic/patients/${clinicId}`)
}


export const getClinicByClinicId = async (clinicId: string) => {
  return await apiClient.get<ClinicByClinicID>(`clinic/${clinicId}`)
}
