import apiClient from "@/fetch/apiClient";

export interface Physician {
  user_id: string;
  physician_id: string;
  name: string;
  email: string;
  rol: string;
  user_status: boolean;
  gender: string;
  last_login: string;
  physician_specialty: string;
  physician_status: boolean;
  clinic_id?: string | null;
}

export interface Patient {
  id: string;
  name: string;
  user_id: string;
  date_of_birth: string;
  address: string;
  eps: string;
  blood_type: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  physician_id: string;
  date_time: string;
  status: string;
  reason: string;
  Patient: Patient;
  Physician: {
    id: string;
    user_id: string;
    physician_specialty: string;
    license_number: string;
    status: boolean;
    clinic_id: string | null;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  patient_name: string;
  patient_gender: string;
  patient_email: string;
  patient_phone: string;
  physician_name: string;
  physician_gender: string;
  physician_email: string;
  physician_phone: string;
}

export const appointmentService = {

  getAppointmentsByPhysicianId: async (physicianId: string): Promise<Appointment[]> => {
    if (!physicianId) {
      console.warn('No physician ID provided to getAppointmentsByPhysicianId');
      return [];
    }
    try {
      console.log('Fetching appointments for physician ID:', physicianId);
      const response = await apiClient.get(`/appointments/getAllByMedicId/${physicianId}`);
      const data = response.data;
      if (!Array.isArray(data)) {
        console.error('Expected array of appointments but got:', data);
        return [];
      }
      console.log('Fetched appointments:', data.length, 'appointments found');
      return data;
    } catch (error) {
      console.error('Error fetching appointments for physician', physicianId, ':', error);
      return [];
    }
  },

  createAppointment: async (appointmentData: {
    patient_id: string;
    physician_id: string;
    clinic_id: string;
    date: string;
    time: string;
    status: string;
    reason: string;
  }): Promise<Appointment> => {
    try {
      const response = await apiClient.post('/appointments/create', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }
}; 