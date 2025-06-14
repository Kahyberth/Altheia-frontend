import apiClient from "@/fetch/apiClient";
import { ILoginRequest, ILoginResponse, IUpdateLabTechnicianRequest, IUpdateOwnerRequest, IUpdatePatientRequest, IUpdatePhysicianRequest, IUpdateReceptionistRequest, PatientDto, VerfySession } from "@/types/auth";

export async function loginService(credentials: ILoginRequest): Promise<ILoginResponse> {
   return await apiClient.post('/auth/login', credentials)
}

export async function verifySessionService() {
    return await apiClient.get('/auth/verify-token')
}

export async function createPatientService(data: {
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
}) {
    return await apiClient.post('/patient/register', data)
}

export async function createPhysicianService(data: {
    name: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
    document_number: string;
    date_of_birth: string;
    physician_specialty: string;
    license_number: string;
    clinic_id: string;
}) {
    return await apiClient.post('/physician/register', data)
}

export async function createReceptionistService(data: {
    name: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
    document_number: string;
    clinic_id: string;
}) {
    return await apiClient.post('/receptionist/register', data)
}

export async function createLabTechnicianService(data: {
    name: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
    document_number: string;
    clinic_id: string;
}) {
    return await apiClient.post('/lab-technician/register', data)
}

export async function logoutService() {
    return await apiClient.post('/auth/logout')
}

export async function updatePatientService(userId: string, data: IUpdatePatientRequest) {
    return await apiClient.patch(`/patient/update/${userId}`, data)
}

export async function updatePhysicianService(userId: string, data: IUpdatePhysicianRequest) {
    return await apiClient.patch(`/physician/update/${userId}`, data)
}

export async function updateReceptionistService(userId: string, data: IUpdateReceptionistRequest) {
    return await apiClient.patch(`/receptionist/update/${userId}`, data)
}

export async function updateLabTechnicianService(userId: string, data: IUpdateLabTechnicianRequest) {
    return await apiClient.patch(`/lab-technician/update/${userId}`, data)
}

export async function ownerUpdateService(userId: string, data: IUpdateOwnerRequest) {
    return await apiClient.patch(`/owner/update/${userId}`, data)
}





