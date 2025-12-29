const API_URL = "http://localhost:8080/api/user/notifications";

export const getUserNotifications = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch notifications");
        return await response.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const response = await fetch(`${API_URL}/read/${notificationId}`, {
            method: "PUT",
        });
        if (!response.ok) throw new Error("Failed to mark notification as read");
        return await response.text();
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};
