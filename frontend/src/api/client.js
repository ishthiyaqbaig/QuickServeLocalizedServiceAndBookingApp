import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',  // Spring Boot backend
});

//  Add a request interceptor to attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // If data is FormData, remove default JSON header
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

//  Global error handling (Unauthorized, Forbidden, etc.)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("⚠️ Token expired or invalid.");

                // Optional auto-logout:
                // localStorage.clear();
                // window.location.href = "/login";
            }

            if (error.response.status === 403) {
                console.warn("🚫 Access denied: Forbidden API call.");
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
