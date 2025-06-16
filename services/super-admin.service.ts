import apiClient from "@/fetch/apiClient";
import { DeactivatedUser, ClinicOwner, PaginatedResponse, SuperAdminData } from "@/types/auth";

export const superAdminService = {
  // Get all deactivated users
  getDeactivatedUsers: async (page: number = 1, limit: number = 10) => {
    return await apiClient.get(`/super-admin/users/deactivated?page=${page}&limit=${limit}`);
  },

  // Get all clinic owners
  getClinicOwners: async (page: number = 1, limit: number = 10) => {
    return await apiClient.get(`/super-admin/users/clinic-owners?page=${page}&limit=${limit}`);
  },

  // Get all system data
  getAllSystemData: async () => {
    return await apiClient.get('/super-admin/system/all-data');
  },

  // Get all super admins
  getAllSuperAdmins: async (): Promise<SuperAdminData[]> => {
    return await apiClient.get('/super-admin/');
  },

  // Get super admin by ID
  getSuperAdminById: async (id: string): Promise<SuperAdminData> => {
    return await apiClient.get(`/super-admin/${id}`);
  },

  // Update super admin
  updateSuperAdmin: async (id: string, data: any) => {
    return await apiClient.patch(`/super-admin/update/${id}`, data);
  },

  // Delete super admin
  deleteSuperAdmin: async (id: string) => {
    return await apiClient.delete(`/super-admin/${id}`);
  },

  // Get user details by ID (existing endpoint)
  getUserDetails: async (userId: string) => {
    return await apiClient.get(`/auth/user/${userId}`);
  },

  // Reactivate user account (existing endpoint)
  reactivateUser: async (userId: string) => {
    return await apiClient.patch(`/auth/user/${userId}/reactivate`);
  },

  // Deactivate user account (existing endpoint)
  deactivateUser: async (userId: string) => {
    return await apiClient.patch(`/auth/user/${userId}/deactivate`);
  },

  // Delete user account (existing endpoint)
  deleteUser: async (userId: string) => {
    return await apiClient.delete(`/auth/user/${userId}`);
  }
}; 