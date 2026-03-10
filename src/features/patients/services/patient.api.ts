import api from '@/lib/api';
import type { CreatePatientPayload, Patient, PatientsListResponse } from '../types/patient.types';

export const patientService = {
    getPatients: async (query?: string, page = 1, limit = 20): Promise<PatientsListResponse> => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        params.set('page', String(page));
        params.set('limit', String(limit));
        const response = await api.get(`/patients?${params.toString()}`);
        return response.data;
    },

    createPatient: async (patientData: CreatePatientPayload): Promise<Patient> => {
        const response = await api.post('/patients', patientData);
        return response.data;
    },


    getPatientById: async (id: string): Promise<Patient> => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    searchPatients: async (query: string): Promise<Patient[]> => {
        const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },
};
