import apiClient from "@/fetch/apiClient";
import { Physician } from "./appointment.service";

export const physicianService = {
getAllPhysicians: async (): Promise<Physician[]> => {
    try {
      const response = await apiClient.get('/physician/getAll');
      const data = response.data;
      if (!Array.isArray(data)) {
        console.error('Expected array of physicians but got:', data);
        return [];
      }
      console.log('Fetched physicians:', data.map(p => ({ id: p.physician_id, name: p.name })));
      return data;
    } catch (error) {
      console.error('Error fetching physicians:', error);
      return [];
    }
  }
}