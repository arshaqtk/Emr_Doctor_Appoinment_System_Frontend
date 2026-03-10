export interface Slot {
    time: string;                       
    isBooked: boolean;
    status: 'available' | 'booked';
}

export type AppointmentStatus = 'BOOKED' | 'ARRIVED';

export interface CreateAppointmentPayload {
    doctorId: string;
    date: string;           
    time: string;           
    patientType: 'EXISTING' | 'NEW';
    patientId?: string;     
    patientData?: {         
        name: string;
        mobile: string;
        email?: string;
        gender?: string;
        age?: number;
    };
    purpose?: string;
    notes?: string;
}

// ── Populated Appointment ───────────────────────────────────────────────────
export interface Appointment {
    _id: string;
    doctor: {
        _id: string;
        user: { name: string; email: string; phone?: string };
        department: string;
        specialization: string;
    };
    patient: {
        _id: string;
        name: string;
        mobile: string;
        patientId: string;
    };
    date: string;
    time: string;
    purpose?: string;
    notes?: string;
    status: AppointmentStatus;
    arrivalTime?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AppointmentsResponse {
    data: Appointment[];
    total: number;
    page: number;
    limit: number;
}
