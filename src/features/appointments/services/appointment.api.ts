import api from '@/lib/api';
import type { Slot, CreateAppointmentPayload, AppointmentsResponse } from '../types/appointment.types';

export const appointmentService = {
    getSlots: async (doctorId: string, date: string): Promise<Slot[]> => {
        const response = await api.get(`/slots?doctorId=${doctorId}&date=${date}`);
        return response.data.data ?? response.data;
    },
    bookAppointment: async (payload: CreateAppointmentPayload) => {
        const response = await api.post('/appointments', payload);
        return response.data;
    },
    getAppointments: async (filters: Record<string, string>): Promise<AppointmentsResponse> => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/appointments?${params}`);
        return response.data;
    },
    markArrived: async (id: string) => {
        const response = await api.patch(`/appointments/${id}/arrive`);
        return response.data;
    },
    cancelAppointment: async (id: string) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },
};
