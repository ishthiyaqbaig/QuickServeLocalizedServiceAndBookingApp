import apiClient from '../api/client';

export const approveListing = async (listingId) => {
    const response = await apiClient.post(`/admin/listings/${listingId}/approve`);
    return response.data;
};

export const rejectListing = async (listingId) => {
    const response = await apiClient.post(`/admin/listings/${listingId}/reject`);
    return response.data;
};
