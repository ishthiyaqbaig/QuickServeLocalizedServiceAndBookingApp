import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Spring Boot backend URL
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle global errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Optional: Redirect to login or clear storage
            // localStorage.clear()
            // window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default apiClient
