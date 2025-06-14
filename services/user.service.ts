import apiClient from "@/fetch/apiClient";

// Retrieve a user profile by ID
export const getUserProfile = async (userId: string) => {
  return await apiClient.get(`/user/${userId}`);
};

// Update user profile. Accepts partial user fields so that callers can pass only the edited info.
export const updateUserProfile = async (userId: string, data: Record<string, unknown>) => {
  return await apiClient.put(`/user/${userId}`, data);
}; 