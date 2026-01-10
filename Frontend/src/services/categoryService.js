import apiClient from '../api/client';

export const getCategories = async () => {
    const response = await apiClient.get("/service_categories");
    return response.data;
};

export const createCategory = async (data) => {
    const response = await apiClient.post("/admin/create-category", data);
    return response.data;
};
