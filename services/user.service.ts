import apiClient from "@/fetch/apiClient";
import { 
  updatePatientService, 
  updatePhysicianService, 
  updateReceptionistService, 
  updateLabTechnicianService, 
  ownerUpdateService 
} from '@/services/auth.service'
import { 
  IUpdatePatientRequest, 
  IUpdatePhysicianRequest, 
  IUpdateReceptionistRequest, 
  IUpdateLabTechnicianRequest, 
  IUpdateOwnerRequest 
} from '@/types/auth'

// Retrieve a user profile by ID
export const getUserProfile = async (userId: string) => {
  return await apiClient.get(`/user/${userId}`);
};

// Get user profile data based on role
export const getUserProfileByRole = async (userId: string, role: string) => {
  const normalizedRole = role.toLowerCase()
  
  switch (normalizedRole) {
    case 'patient':
      return await apiClient.get(`/patient/${userId}`)
    case 'physician':
      return await apiClient.get(`/physician/${userId}`)
    case 'receptionist':
      return await apiClient.get(`/receptionist/${userId}`)
    case 'lab_technician':
      return await apiClient.get(`/lab-technician/${userId}`)
    case 'owner':
    case 'clinic_owner':
      return await apiClient.get(`/owner/${userId}`)
    default:
      throw new Error(`Rol no soportado: ${role}`)
  }
}

// Update user profile. Accepts partial user fields so that callers can pass only the edited info.
export async function updateUserProfile(
  userId: string, 
  role: string, 
  data: IUpdatePatientRequest | IUpdatePhysicianRequest | IUpdateReceptionistRequest | IUpdateLabTechnicianRequest | IUpdateOwnerRequest
) {
  const normalizedRole = role.toLowerCase()
  
  switch (normalizedRole) {
    case 'patient':
      return await updatePatientService(userId, data as IUpdatePatientRequest)
    case 'physician':
      return await updatePhysicianService(userId, data as IUpdatePhysicianRequest)
    case 'receptionist':
      return await updateReceptionistService(userId, data as IUpdateReceptionistRequest)
    case 'lab_technician':
      return await updateLabTechnicianService(userId, data as IUpdateLabTechnicianRequest)
    case 'owner':
    case 'clinic_owner':
      return await ownerUpdateService(userId, data as IUpdateOwnerRequest)
    default:
      throw new Error(`Rol no soportado: ${role}`)
  }
} 