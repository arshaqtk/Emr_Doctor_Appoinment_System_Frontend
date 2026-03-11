import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { doctorScheduleApi } from '../services/doctorSchedule.api';
import type { DoctorOption, DoctorSchedule, Slot, UpdateSchedulePayload } from '../types/schedule.types';
import { DoctorScheduleCalendar } from '../components/DoctorScheduleCalendar';
import { SlotGrid } from '../components/SlotGrid';
import { ScheduleForm } from '../components/ScheduleForm';

export const DoctorSchedulePage = () => {
    // Selection state
    const [doctorsList, setDoctorsList] = useState<DoctorOption[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Data state
    const [scheduleData, setScheduleData] = useState<DoctorSchedule | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);

    // Loading & Error states
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [slotsError, setSlotsError] = useState<string | null>(null);

    // Initial load: Fetch dropdown of doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const docs = await doctorScheduleApi.getDoctorsList();
                setDoctorsList(docs);
                if (docs.length > 0) {
                    setSelectedDoctorId(docs[0]._id);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Failed to load doctors list');
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Load Schedule when selected doctor changes
    useEffect(() => {
        if (!selectedDoctorId) return;

        const loadSchedule = async () => {
            try {
                const data = await doctorScheduleApi.getDoctorSchedule(selectedDoctorId);
                setScheduleData(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load doctor schedule');
            }
        };

        loadSchedule();
    }, [selectedDoctorId]);

    // Load slots when Doctor + Date changes
    useEffect(() => {
        if (!selectedDoctorId || !selectedDate) return;

        const loadSlots = async () => {
            setIsSlotsLoading(true);
            setSlotsError(null);
            try {
                const data = await doctorScheduleApi.getSlotsByDate(selectedDoctorId, selectedDate);
                setSlots(data || []);
            } catch (err: any) {
                setSlotsError(err.response?.data?.message || 'Failed to load generated slots');
            } finally {
                setIsSlotsLoading(false);
            }
        };

        loadSlots();
    }, [selectedDoctorId, selectedDate]);

    // Save updated schedule
    const handleUpdateSchedule = async (payload: UpdateSchedulePayload) => {
        if (!selectedDoctorId) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const updated = await doctorScheduleApi.updateDoctorSchedule(selectedDoctorId, payload);
            setScheduleData(updated);

           
            const newData = await doctorScheduleApi.getSlotsByDate(selectedDoctorId, selectedDate);
            setSlots(newData || []);

            
            toast.success('Schedule updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update schedule');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Doctor Scheduler</h1>
                <p className="text-gray-500 mt-1">Manage working hours, set break times, and visually verify generated slots.</p>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Doctor Selection Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <label className="text-gray-700 font-semibold md:w-48">Select Doctor Profile:</label>
                <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="flex-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                    {doctorsList.length === 0 && <option disabled value="">No doctors found</option>}
                    {doctorsList.map(doc => {
                        const userName = typeof doc.user === 'object' ? doc.user.name : doc.user;
                        return (
                            <option key={doc._id} value={doc._id}>
                                Dr. {userName} ({doc.department})
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Visualizer Row */}
            {selectedDoctorId && (
                <div className="flex flex-col lg:flex-row items-stretch">
                    <div className="w-full lg:w-1/3">
                        <DoctorScheduleCalendar
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                        />
                    </div>

                    <SlotGrid
                        slots={slots}
                        isLoading={isSlotsLoading}
                        error={slotsError}
                    />
                </div>
            )}

            {/* Form Section */}
            {selectedDoctorId && scheduleData && (
                <ScheduleForm
                    initialData={scheduleData}
                    onSubmit={handleUpdateSchedule}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
};
