import apiClient from '../api/client'

export const updateProfile = async (profileData) => {
    const response = await apiClient.post('/providers/profile', profileData)
    return response.data
}
