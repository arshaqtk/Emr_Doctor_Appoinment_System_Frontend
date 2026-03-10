import { useState } from 'react';
import type { CreateUserPayload } from '../types/admin.types';

interface UserFormProps {
    onSubmit: (payload: CreateUserPayload, role: 'DOCTOR' | 'RECEPTIONIST') => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const UserForm = ({ onSubmit, onCancel, isLoading }: UserFormProps) => {
    const [role, setRole] = useState<'DOCTOR' | 'RECEPTIONIST'>('RECEPTIONIST');
    const [formData, setFormData] = useState<CreateUserPayload>({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'role') {
            setRole(value as 'DOCTOR' | 'RECEPTIONIST');
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, role);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New User</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
                    <select
                        name="role"
                        value={role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="DOCTOR">Doctor</option>
                    </select>
                    <p className="mt-1 flex text-xs text-gray-500">
                        {role === 'DOCTOR'
                            ? "After creating the Doctor's user account, you must create their profile in Manage Doctors."
                            : 'Receptionists get immediate access to the portal once created.'}
                    </p>
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
                    {isLoading ? 'Creating...' : `Create ${role === 'DOCTOR' ? 'Doctor' : 'Receptionist'}`}
                </button>
            </div>
        </form>
    );
};
