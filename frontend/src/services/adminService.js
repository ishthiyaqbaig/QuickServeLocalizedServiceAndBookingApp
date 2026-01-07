import apiClient from '../api/client';

// Listings
export const getListings = async () => {
    const response = await apiClient.get('/admin/listings');
    return response.data;
};

export const approveListing = async (listingId, adminId, reason = 'Verified') => {
    const response = await apiClient.post(`/admin/listings/${listingId}/approve`, null, {
        params: { adminId, reason }
    });
    return response.data;
};

export const rejectListing = async (listingId, adminId, reason = 'Invalid details') => {
    const response = await apiClient.post(`/admin/listings/${listingId}/reject`, null, {
        params: { adminId, reason }
    });
    return response.data;
};

// Users
export const getUsers = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};

// Categories
export const getCategories = async () => {
    const response = await apiClient.get('/service_categories');
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await apiClient.post('/admin/create-category', categoryData);
    return response.data;
};

// Analytics
export const getTopCategories = async () => {
    const response = await apiClient.get('/admin/analytics/top-categories');
    return response.data;
};

export const getTopServices = async () => {
    const response = await apiClient.get('/admin/analytics/top-services');
    return response.data;
};
