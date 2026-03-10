import api from '@/lib/api'
import type {
    User,
    DoctorProfile,
    CreateUserPayload,
    CreateDoctorProfilePayload,
    UpdateAvailabilityPayload,
} from '../types/admin.types'

// ─── Response shapes from the backend ────────────────────────────────────────
interface DoctorsResponse {
    success: boolean;
    count: number;
    data: DoctorProfile[];
}

interface DoctorResponse {
    success: boolean;
    data: DoctorProfile;
}

interface UsersResponse {
    success: boolean;
    users: User[];
}

interface UserResponse {
    success: boolean;
    user: User;
}

// ─── API layer ───────────────────────────────────────────────────────────────
export const adminApi = {

    // ── Doctors ──────────────────────────────────────────────────────────────

 
    getDoctors: async (department?: string): Promise<DoctorProfile[]> => {
        const params = department ? { department } : {};
        const { data } = await api.get<DoctorsResponse>('/doctors', { params });
        return data.data;
    },

   
    getDoctorById: async (id: string): Promise<DoctorProfile> => {
        const { data } = await api.get<DoctorResponse>(`/doctors/${id}`);
        return data.data;
    },

  
    createDoctorProfile: async (payload: CreateDoctorProfilePayload): Promise<DoctorProfile> => {
        const { data } = await api.post<DoctorResponse>('/doctors', payload);
        return data.data;
    },

   
    updateDoctor: async (id: string, payload: Partial<CreateDoctorProfilePayload>): Promise<DoctorProfile> => {
        const { data } = await api.patch<DoctorResponse>(`/doctors/${id}`, payload);
        return data.data;
    },

    
    updateAvailability: async (id: string, payload: UpdateAvailabilityPayload): Promise<DoctorProfile> => {
        const { data } = await api.patch<DoctorResponse>(`/doctors/${id}/availability`, payload);
        return data.data;
    },

    // ── Users ────────────────────────────────────────────────────────────────

    
    getUsers: async (): Promise<User[]> => {
        const { data } = await api.get<UsersResponse>('/users');
        return data.users;
    },

    
    createDoctorUser: async (payload: CreateUserPayload): Promise<User> => {
        const { data } = await api.post<UserResponse>('/users/doctor', payload);
        return data.user;
    },

   
    createReceptionist: async (payload: CreateUserPayload): Promise<User> => {
        const { data } = await api.post<UserResponse>('/users/receptionist', payload);
        return data.user;
    },

 
    patchUser: async (id: string, payload: Partial<User>): Promise<User> => {
        const { data } = await api.patch<UserResponse>(`/users/${id}`, payload);
        return data.user;
    },
}
