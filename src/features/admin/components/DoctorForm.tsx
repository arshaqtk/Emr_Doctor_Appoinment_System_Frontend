import { useState } from 'react';
import type { CreateDoctorProfilePayload, User } from '../types/admin.types';

interface DoctorFormProps {
    initialData?: Partial<CreateDoctorProfilePayload>;
    availableUsers?: User[];
    onSubmit: (payload: CreateDoctorProfilePayload) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DoctorForm = ({ initialData, availableUsers = [], onSubmit, onCancel, isLoading }: DoctorFormProps) => {
    const [formData, setFormData] = useState<Partial<CreateDoctorProfilePayload>>(
        initialData || {
            user: '',
            specialization: '',
            department: '',
            experience: 0,
            qualification: '',
            consultationFee: 0,
            slotDuration: 30,
            workingHours: { start: '09:00', end: '17:00' },
            availableDays: [],
            breakTimes: [],
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value,
                },
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleDayToggle = (day: string) => {
        setFormData((prev) => {
            const current = prev.availableDays || [];
            const updated = current.includes(day)
                ? current.filter((d) => d !== day)
                : [...current, day];
            return { ...prev, availableDays: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as CreateDoctorProfilePayload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                {initialData ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User ObjectId — typically selected from a list or entered after creating user account */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link to User Account
                    </label>
                    {initialData ? (
                        <input
                            type="text"
                            value="Cannot change user during editing"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed"
                        />
                    ) : (
                        <select
                            name="user"
                            value={formData.user || ''}
                            onChange={handleChange as any}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="" disabled>Select a User...</option>
                            {availableUsers.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                            {availableUsers.length === 0 && (
                                <option value="" disabled>No unassigned Doctor accounts available</option>
                            )}
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input
                        type="text"
                        name="specialization"
                        value={formData.specialization || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <input
                        type="text"
                        name="qualification"
                        value={formData.qualification || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input
                        type="number"
                        name="experience"
                        value={formData.experience || 0}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                    <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee || 0}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (Mins)</label>
                    <input
                        type="number"
                        name="slotDuration"
                        value={formData.slotDuration || 30}
                        onChange={handleChange}
                        required
                        min="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Start</label>
                        <input
                            type="time"
                            name="workingHours.start"
                            value={formData.workingHours?.start || '09:00'}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work End</label>
                        <input
                            type="time"
                            name="workingHours.end"
                            value={formData.workingHours?.end || '17:00'}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Available Days */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${formData.availableDays?.includes(day)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Doctor Profile'}
                </button>
            </div>
        </form>
    );
};
