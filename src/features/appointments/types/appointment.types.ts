
export type AppointmentStatus = 'BOOKED' | 'ARRIVED';

// Matches backend IAppointment with populated doctor and patient
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
    date: string;       // YYYY-MM-DD
    time: string;       // HH:mm
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
