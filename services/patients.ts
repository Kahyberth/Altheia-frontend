import apiClient from "@/fetch/apiClient";
import { Patient } from "./appointment.service";

export interface PatientData {
    id: string;
    user_id: string;
    name: string;
    date_of_birth: string;
    address: string;
    gender: string;
    email: string;
    phone: string;
    next_appointment: string;
    eps: string;
    blood_type: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface PatientPaginated {
    patients: PatientData[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
}

export const patientService = {
    getAllPatients: async (): Promise<Patient[]> => {
        try {
            const response = await apiClient.get('/patient/getAll');
            const data = response.data;
            if (!Array.isArray(data)) {
                console.error('Expected array of patients but got:', data);
                return [];
            }
            console.log('Fetched patients:', data.map(p => ({ id: p.id, name: p.name })));
            return data;
        } catch (error) {
            console.error('Error fetching patients:', error);
            return [];
        }
    },

    getAllPatientsPaginated: async (page: number, limit: number): Promise<PatientPaginated> => {
        try {
            const response = await apiClient.get(`/patient/getAllPaginated?page=${page}&limit=${limit}`);
            const data = response.data;
            return {
                patients: data.result,
                totalPages: data.total,
                currentPage: data.page,
                totalItems: data.total,
                itemsPerPage: data.limit
            };
        } catch (error) {
            console.error('Error fetching patients:', error);
            return {
                patients: [],
                totalPages: 0,
                currentPage: 0,
                totalItems: 0,
                itemsPerPage: 0
            };
        }
    },

    exportAllPatients: async (): Promise<Blob> => {
        try {
            const response = await apiClient.post('/patient/export/All', 
                {},
                {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting all patients:', error);
            throw error;
        }
    },

    exportSelectedPatients: async (patientIds: string[]): Promise<Blob> => {
        try {
            const response = await apiClient.post('/patient/export/Selected', 
                { patient_ids: patientIds },
                { 
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error exporting selected patients:', error);
            throw error;
        }
    }
}