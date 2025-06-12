import apiClient from "@/fetch/apiClient";
import { ILoginRequest, ILoginResponse, PatientDto, VerfySession } from "@/types/auth";

export async function loginService(credentials: ILoginRequest): Promise<ILoginResponse> {
   return await apiClient.post('/auth/login', credentials)
}

export async function verifySessionService() {
    return await apiClient.get('/auth/verify-token')
}

export async function createPatientService(data: PatientDto) {
    return await apiClient.post('/patient/register', data)
}

export async function logoutService() {
    return await apiClient.post('/auth/logout')
}