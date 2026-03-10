import api from '@/lib/api'

export const doctorService = {
    getDoctors: async (department?: string, page: number = 1, limit: number = 10) => {
        const params = new URLSearchParams()
        if (department) params.append('department', department)
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await api.get(`/doctors?${params.toString()}`)
        return response.data
    },

    getDoctorById: async (id: string) => {
        const response = await api.get(`/doctors/${id}`)
        return response.data
    },

    updateAvailability: async (id: string, availabilityData: any) => {
        const response = await api.patch(`/doctors/${id}/availability`, availabilityData)
        return response.data
    }
}
