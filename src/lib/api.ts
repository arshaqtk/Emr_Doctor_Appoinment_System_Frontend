import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config


        if (
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/login')
        ) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
                return api(originalRequest)
            } catch (refreshError) {
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
