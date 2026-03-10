import api from '@/lib/api'

export const patientService = {
    createPatient: async (patientData: any) => {
        const response = await api.post('/patients', patientData)
        return response.data
    },

    searchPatients: async (query: string) => {
        const response = await api.get(`/patients/search?q=${query}`)
        return response.data
    },

    getPatientById: async (id: string) => {
        const response = await api.get(`/patients/${id}`)
        return response.data
    }
}
