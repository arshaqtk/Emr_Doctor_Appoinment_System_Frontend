import api from '@/lib/api';
import type { Slot, DoctorSchedule, UpdateSchedulePayload, DoctorOption } from '../types/schedule.types';

export const doctorScheduleApi = {

    getDoctorSchedule: async (doctorId: string): Promise<DoctorSchedule> => {
        const { data } = await api.get(`/doctors/${doctorId}`);
        return data.data;
    },


    createDoctorSchedule: async (doctorId: string, payload: UpdateSchedulePayload): Promise<DoctorSchedule> => {
        const { data } = await api.patch(`/doctors/${doctorId}/availability`, payload);
        return data.data;
    },

    updateDoctorSchedule: async (doctorId: string, payload: UpdateSchedulePayload): Promise<DoctorSchedule> => {
        const { data } = await api.patch(`/doctors/${doctorId}/availability`, payload);
        return data.data;
    },


    getSlotsByDate: async (doctorId: string, date: string): Promise<Slot[]> => {
        const { data } = await api.get('/slots', { params: { doctorId, date } });
        return data.data || [];
    },

    getDoctorsList: async (): Promise<DoctorOption[]> => {
        const { data } = await api.get('/doctors');
        return data.data || [];
    }
};
