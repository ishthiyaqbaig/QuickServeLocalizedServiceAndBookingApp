import apiClient from "../api/client";

export const searchProviders = async (lat, lng, categoryId) => {
    const res = await apiClient.get('/customer/search', {
        params: { lat, lng, categoryId }
    });
    return res.data;
};
