import api from '@/lib/api'

export const appointmentService = {
    getSlots: async (doctorId: string, date: string) => {
        const response = await api.get(`/slots?doctorId=${doctorId}&date=${date}`)
        return response.data
    },

    bookAppointment: async (appointmentData: any) => {
        const response = await api.post('/appointments', appointmentData)
        return response.data
    },

    getAppointments: async (filters: any) => {
        const params = new URLSearchParams(filters).toString()
        const response = await api.get(`/appointments?${params}`)
        return response.data
    },

    markArrived: async (id: string) => {
        const response = await api.patch(`/appointments/${id}/arrive`)
        return response.data
    },

    cancelAppointment: async (id: string) => {
        const response = await api.delete(`/appointments/${id}`)
        return response.data
    }
}
