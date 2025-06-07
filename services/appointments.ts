import apiClient from "@/fetch/apiClient";



export const getAppointments = async () => {
    const response = await apiClient.get("/appointments");
    return response.data;
};





