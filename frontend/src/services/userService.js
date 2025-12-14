import apiClient from '../api/client';

export const updateProfile = async (userId, data) => {
    const response = await apiClient.put(`/user/${userId}/profile`, data);
    return response.data;
};

export const updateLocation = async (userId, data) => {
    const response = await apiClient.put(`/user/${userId}/location`, data);
    return response.data;
};
