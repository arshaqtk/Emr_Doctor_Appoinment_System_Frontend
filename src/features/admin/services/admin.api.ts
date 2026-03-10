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

    /** GET /api/doctors?department=... */
    getDoctors: async (department?: string): Promise<DoctorProfile[]> => {
        const params = department ? { department } : {};
        const { data } = await api.get<DoctorsResponse>('/doctors', { params });
        return data.data;
    },

    /** GET /api/doctors/:id */
    getDoctorById: async (id: string): Promise<DoctorProfile> => {
        const { data } = await api.get<DoctorResponse>(`/doctors/${id}`);
        return data.data;
    },

    /** POST /api/doctors — creates a Doctor profile (SUPER_ADMIN only) */
    createDoctorProfile: async (payload: CreateDoctorProfilePayload): Promise<DoctorProfile> => {
        const { data } = await api.post<DoctorResponse>('/doctors', payload);
        return data.data;
    },

    /**
     * PATCH /api/doctors/:id — updates non-scheduling fields
     * (the backend strips workingHours, breakTimes, slotDuration, availableDays)
     */
    updateDoctor: async (id: string, payload: Partial<CreateDoctorProfilePayload>): Promise<DoctorProfile> => {
        const { data } = await api.patch<DoctorResponse>(`/doctors/${id}`, payload);
        return data.data;
    },

    /** PATCH /api/doctors/:id/availability — updates scheduling fields */
    updateAvailability: async (id: string, payload: UpdateAvailabilityPayload): Promise<DoctorProfile> => {
        const { data } = await api.patch<DoctorResponse>(`/doctors/${id}/availability`, payload);
        return data.data;
    },

    // ── Users ────────────────────────────────────────────────────────────────

    /** GET /api/users (SUPER_ADMIN only) */
    getUsers: async (): Promise<User[]> => {
        const { data } = await api.get<UsersResponse>('/users');
        return data.users;
    },

    /** POST /api/users/doctor — creates a User account with role DOCTOR */
    createDoctorUser: async (payload: CreateUserPayload): Promise<User> => {
        const { data } = await api.post<UserResponse>('/users/doctor', payload);
        return data.user;
    },

    /** POST /api/users/receptionist — creates a User account with role RECEPTIONIST */
    createReceptionist: async (payload: CreateUserPayload): Promise<User> => {
        const { data } = await api.post<UserResponse>('/users/receptionist', payload);
        return data.user;
    },

    /** PATCH /api/users/:id — update any allowed fields (role, isActive, etc.) */
    patchUser: async (id: string, payload: Partial<User>): Promise<User> => {
        const { data } = await api.patch<UserResponse>(`/users/${id}`, payload);
        return data.user;
    },
}
