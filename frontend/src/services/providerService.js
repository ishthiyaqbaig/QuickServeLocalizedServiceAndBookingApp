import apiClient from '../api/client'

export const createListing = async (providerId, formData) => {
    // Content-Type multipart/form-data is usually set automatically by axios when data is FormData
    const response = await apiClient.post(`/provider/${providerId}/listings`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const searchProviders = async (lat, lng, categoryId) => {
    const response = await apiClient.get(`/search`, {
        params: { lat, lng, categoryId }
    })
    return response.data
}
