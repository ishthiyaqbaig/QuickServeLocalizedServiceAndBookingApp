import apiClient from "../api/client";

export const getUserNotifications = async (userId) => {
   const response = await apiClient.get(
        `/user/notifications/${userId}`)
        return response.data;
};


export const markAsRead = async (notificationId) => {
    const response = await apiClient.put(
        `/user/notifications/read/${notificationId}`)
        return response.data;
};
