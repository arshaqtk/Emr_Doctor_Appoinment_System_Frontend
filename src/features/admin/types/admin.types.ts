export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
    phone?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface DoctorProfile {
    _id: string;
    user: Pick<User, '_id' | 'name' | 'email'> & { phone?: string } | string;
    specialization: string;
    department: string;
    experience: number;
    qualification: string;
    consultationFee: number;
    slotDuration: number;
    workingHours: {
        start: string;
        end: string;
    };
    availableDays: string[];
    breakTimes: Array<{
        start: string;
        end: string;
    }>;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/** POST /api/users/doctor — creates a User account with role DOCTOR */
export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

/** POST /api/doctors — creates a Doctor profile linked to a User */
export interface CreateDoctorProfilePayload {
    user: string; // User ObjectId
    specialization: string;
    department: string;
    experience: number;
    qualification: string;
    consultationFee: number;
    slotDuration: number;
    workingHours: {
        start: string;
        end: string;
    };
    availableDays: string[];
    breakTimes?: Array<{
        start: string;
        end: string;
    }>;
}

/** PATCH /api/doctors/:id/availability */
export interface UpdateAvailabilityPayload {
    slotDuration?: number;
    workingHours?: {
        start: string;
        end: string;
    };
    breakTimes?: Array<{
        start: string;
        end: string;
    }>;
    availableDays?: string[];
}
