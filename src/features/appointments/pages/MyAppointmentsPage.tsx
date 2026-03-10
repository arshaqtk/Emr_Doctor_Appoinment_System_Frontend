import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AppointmentFilters } from '../components/AppointmentFilters';
import { AppointmentTable } from '../components/AppointmentTable';
import type { Appointment, AppointmentsResponse } from '../types/appointment.types';

const LIMIT = 20;

export const MyAppointmentsPage = () => {
    const { user } = useAuthStore();

    // Resolve doctor's own _id from their user account
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Filters
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);

    // Appointments data
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1 — resolve doctorId once
    useEffect(() => {
        api.get('/doctors/me')
            .then(res => setDoctorId(res.data.data._id))
            .catch(err => setProfileError(err.response?.data?.message || 'Could not load your doctor profile.'));
    }, []);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [selectedDate, statusFilter]);

    // Step 2 — fetch appointments whenever doctorId / filters / page change
    const fetchAppointments = useCallback(async () => {
        if (!doctorId) return;
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ doctorId, page: String(page), limit: String(LIMIT) });
            if (selectedDate) params.set('date', selectedDate);
            if (statusFilter) params.set('status', statusFilter);

            const res = await api.get<AppointmentsResponse>(`/appointments?${params}`);
            setAppointments(res.data.data);
            setTotal(res.data.total);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load appointments.');
        } finally {
            setIsLoading(false);
        }
    }, [doctorId, selectedDate, statusFilter, page]);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const handleClearFilters = () => {
        setSelectedDate('');
        setStatusFilter('');
    };

    if (profileError) {
        return (
            <div className="p-6">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {profileError}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-gray-500 text-sm mt-0.5">Dr. {user?.name} — appointments scheduled for you</p>
            </div>

            {/* Filters */}
            <AppointmentFilters
                selectedDate={selectedDate}
                statusFilter={statusFilter}
                onDateChange={setSelectedDate}
                onStatusChange={setStatusFilter}
                onClear={handleClearFilters}
            />

            {/* Table */}
            <AppointmentTable
                appointments={appointments}
                isLoading={isLoading}
                error={error}
                selectedDate={selectedDate}
                total={total}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
            />
        </div>
    );
};
