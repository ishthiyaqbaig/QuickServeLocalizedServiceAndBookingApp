import apiClient from '../api/client'

export const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
}

export const register = async (userData) => {
    const response = await apiClient.post('/auth/signup', userData)
    return response.data
}
