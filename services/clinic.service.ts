import { ClinicInformation, Services, EPS } from "@/types/clinic"
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