export type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'RECEPTIONIST'

export interface User {
    _id: string
    name: string
    email: string
    role: UserRole
    phone?: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    success: boolean
    message: string
    user: User
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (user: User) => void
    logout: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}
