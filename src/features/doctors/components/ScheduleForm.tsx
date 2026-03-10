import { useState, useEffect } from 'react';
import type { UpdateSchedulePayload, DoctorSchedule } from '../types/schedule.types';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ScheduleFormProps {
    initialData?: DoctorSchedule | null;
    onSubmit: (payload: UpdateSchedulePayload) => void;
    isLoading: boolean;
}

export const ScheduleForm = ({ initialData, onSubmit, isLoading }: ScheduleFormProps) => {
    const [formData, setFormData] = useState<UpdateSchedulePayload>({
        slotDuration: 30,
        workingHours: { start: '09:00', end: '17:00' },
        availableDays: [],
        breakTimes: [],
    });

    // Populate data when available
    useEffect(() => {
        if (initialData) {
            setFormData({
                slotDuration: initialData.slotDuration || 30,
                workingHours: initialData.workingHours || { start: '09:00', end: '17:00' },
                availableDays: initialData.availableDays || [],
                breakTimes: initialData.breakTimes || []
            });
        }
    }, [initialData]);

    const handleWorkingHoursChange = (field: 'start' | 'end', value: string) => {
        setFormData(prev => ({
            ...prev,
            workingHours: { ...prev.workingHours, [field]: value }
        }));
    };

    const handleDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    const handleAddBreak = () => {
        setFormData(prev => ({
            ...prev,
            breakTimes: [...prev.breakTimes, { start: '13:00', end: '14:00' }]
        }));
    };

    const handleUpdateBreak = (index: number, field: 'start' | 'end', value: string) => {
        setFormData(prev => {
            const updated = [...prev.breakTimes];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, breakTimes: updated };
        });
    };

    const handleRemoveBreak = (index: number) => {
        setFormData(prev => ({
            ...prev,
            breakTimes: prev.breakTimes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6 max-w-4xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Update Working Schedule</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Slot Duration (Mins)</label>
                        <input
                            type="number"
                            min="5"
                            value={formData.slotDuration}
                            onChange={(e) => setFormData(p => ({ ...p, slotDuration: Number(e.target.value) }))}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Base Working Hours</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <span className="text-xs text-gray-500 mb-1 block">Start</span>
                                <input
                                    type="time"
                                    required
                                    value={formData.workingHours.start}
                                    onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs text-gray-500 mb-1 block">End</span>
                                <input
                                    type="time"
                                    required
                                    value={formData.workingHours.end}
                                    onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Available Days</label>
                        <div className="flex flex-wrap gap-2">
                            {WEEKDAYS.map(day => {
                                const isSelected = formData.availableDays.includes(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayToggle(day)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Break Times */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-gray-800">Break Times / Blocks</label>
                        <button
                            type="button"
                            onClick={handleAddBreak}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md"
                        >
                            + Add Break
                        </button>
                    </div>

                    {formData.breakTimes.length === 0 ? (
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 bg-gray-50">
                            No breaks scheduled. Doctor will be available continuously from Start to End.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {formData.breakTimes.map((bt, idx) => (
                                <div key={idx} className="flex gap-3 items-end p-3 bg-gray-50 border border-gray-200 rounded-lg relative">
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-500 mb-1 block">Break Start</span>
                                        <input
                                            type="time"
                                            required
                                            value={bt.start}
                                            onChange={(e) => handleUpdateBreak(idx, 'start', e.target.value)}
                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-500 mb-1 block">Break End</span>
                                        <input
                                            type="time"
                                            required
                                            value={bt.end}
                                            onChange={(e) => handleUpdateBreak(idx, 'end', e.target.value)}
                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBreak(idx)}
                                        className="mb-1 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md"
                                        title="Remove break"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Save Updated Schedule'}
                </button>
            </div>
        </form>
    );
};
