import apiClient from "@/fetch/apiClient";
import { Patient } from "./appointments";

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
    }
}