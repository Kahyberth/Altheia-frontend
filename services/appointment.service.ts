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
  clinic_name: string;
  clinic_city: string;
  clinic_address: string;
  clinic_id: string;
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
      }
      console.log('Fetched appointments:', data.length, 'appointments found');
      return data;
    } catch (error) {
      console.error('Error fetching appointments for physician', physicianId, ':', error);
      return [];
    }
  },

  getAppointmentsByUserId: async (userId: string): Promise<Appointment[]> => {
    if (!userId) {
      console.warn('No user ID provided to getAppointmentsByUserId');
      return [];
    }
    try {
      console.log('Fetching appointments for user ID:', userId);
      const response = await apiClient.get(`/appointments/getAllByUserId/${userId}`);
      const data = response.data;
      if (!Array.isArray(data)) {
        console.error('Expected array of appointments but got:', data);
        return [];
      }
      console.log('Fetched appointments for user:', data.length, 'appointments found');
      return data;
    } catch (error) {
      console.error('Error fetching appointments for user', userId, ':', error);
      return [];
    }
  },

  getAppointmentsByPhysicianAndDate: async (physicianId: string, date: string): Promise<Appointment[]> => {
    if (!physicianId || !date) {
      console.warn('Missing physicianId or date for getAppointmentsByPhysicianAndDate');
      return [];
    }
    try {
      console.log('Fetching appointments for physician:', physicianId, 'on date:', date);
      const allAppointments = await appointmentService.getAppointmentsByPhysicianId(physicianId);
      
      const filteredAppointments = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date_time).toISOString().split('T')[0];
        return appointmentDate === date && appointment.status !== 'cancelled';
      });
      
      console.log('Found', filteredAppointments.length, 'appointments for date:', date);
      return filteredAppointments;
    } catch (error) {
      console.error('Error fetching appointments for physician and date:', error);
      return [];
    }
  },

  checkTimeConflict: async (physicianId: string, date: string, startTime: string, duration: number = 30): Promise<boolean> => {
    try {
      const existingAppointments = await appointmentService.getAppointmentsByPhysicianAndDate(physicianId, date);
      
      const newStart = new Date(`${date}T${startTime}:00`);
      const newEnd = new Date(newStart.getTime() + duration * 60000);
      
      for (const appointment of existingAppointments) {
        const existingStart = new Date(appointment.date_time);
        const existingEnd = new Date(existingStart.getTime() + 30 * 60000);
        
        if (newStart < existingEnd && newEnd > existingStart) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking time conflict:', error);
      return true;
    }
  },

  getOccupiedTimes: async (physicianId: string, date: string, excludeAppointmentId?: string): Promise<string[]> => {
    try {
      console.log(`Getting occupied times for physician ${physicianId} on ${date}${excludeAppointmentId ? ` (excluding appointment ${excludeAppointmentId})` : ''}`);
      const appointments = await appointmentService.getAppointmentsByPhysicianAndDate(physicianId, date);
      
      // Filter out the current appointment being rescheduled
      const filteredAppointments = excludeAppointmentId 
        ? appointments.filter(appointment => appointment.id !== excludeAppointmentId)
        : appointments;
      
      const occupiedTimes = filteredAppointments.map(appointment => {
        const appointmentTime = new Date(appointment.date_time);
        const timeString = appointmentTime.toTimeString().slice(0, 5);
        console.log(`Appointment ${appointment.id}: ${appointment.date_time} -> ${timeString} (Status: ${appointment.status})`);
        return timeString;
      });

      console.log(`Total occupied times for ${date}:`, occupiedTimes);
      return occupiedTimes;
    } catch (error) {
      console.error('Error getting occupied times:', error);
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
  },

  updateStatus: async (appointmentId: string, status: string): Promise<Appointment> => {
    try {
      const response = await apiClient.put(`/appointments/updateStatus/${appointmentId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  cancelAppointment: async (appointmentId: string): Promise<Appointment> => {
    try {
      const response = await apiClient.patch(`/appointments/cancel/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw error;
    }
  },

  rescheduleAppointment: async (appointmentId: string, newDateTime: string): Promise<Appointment> => {
    try {
      const response = await apiClient.patch(`/appointments/reschedule/${appointmentId}`, {
        new_date_time: newDateTime
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  }
}; 