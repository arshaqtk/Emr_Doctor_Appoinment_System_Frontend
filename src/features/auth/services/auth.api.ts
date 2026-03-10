import api from '@/lib/api'
import type { LoginCredentials, LoginResponse } from '../types/auth.types'

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials)
        return response.data
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
    },

    refresh: async (): Promise<void> => {
        await api.post('/auth/refresh')
    },
}
