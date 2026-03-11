import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { AppointmentFilters } from '../components/AppointmentFilters';
import { AppointmentTable } from '../components/AppointmentTable';
import { appointmentService } from '../services/appointment.api';
import type { Appointment, AppointmentsResponse } from '../types/appointment.types';

const LIMIT = 20;

export const AppointmentsListPage = () => {
    const location = useLocation();

    // Filters
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);


    useEffect(() => {
        if (location.state?.successMsg) {
            toast.success(location.state.successMsg);
            // Clear state so toast doesn't show on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Appointments data
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [selectedDate, statusFilter]);

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
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
    }, [selectedDate, statusFilter, page]);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const handleClearFilters = () => {
        setSelectedDate('');
        setStatusFilter('');
    };

    const handleMarkArrived = async (id: string) => {
        try {
            await appointmentService.markArrived(id);
            toast.success('Patient marked as arrived!');
            fetchAppointments();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Booked Appointments</h1>
                <p className="text-gray-500 text-sm mt-0.5">List of all scheduled appointments</p>
            </div>

            <AppointmentFilters
                selectedDate={selectedDate}
                statusFilter={statusFilter}
                onDateChange={setSelectedDate}
                onStatusChange={setStatusFilter}
                onClear={handleClearFilters}
            />

            <AppointmentTable
                appointments={appointments}
                isLoading={isLoading}
                error={error}
                selectedDate={selectedDate}
                total={total}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onMarkArrived={handleMarkArrived}
                showDoctor={true}
            />
        </div>
    );
};
