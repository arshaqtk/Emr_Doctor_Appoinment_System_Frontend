import { useState } from 'react';
import type { CreatePatientPayload } from '../types/patient.types';

interface PatientFormProps {
    onSubmit: (data: CreatePatientPayload) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const PatientForm = ({ onSubmit, isLoading, error }: PatientFormProps) => {
    const [form, setForm] = useState<CreatePatientPayload>({
        name: '',
        mobile: '',
        email: '',
        gender: '',
        age: undefined,
    });

    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CreatePatientPayload, string>>>({});

    const validate = (): boolean => {
        const errs: Partial<Record<keyof CreatePatientPayload, string>> = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
        else if (!/^\d{10}$/.test(form.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
        if (form.age !== undefined && form.age !== null && (form.age < 0 || form.age > 150)) errs.age = 'Enter a valid age';
        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'age' ? (value === '' ? undefined : Number(value)) : value,
        }));
        if (validationErrors[name as keyof CreatePatientPayload]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreatePatientPayload = {
            name: form.name.trim(),
            mobile: form.mobile.trim(),
        };
        if (form.email?.trim()) payload.email = form.email.trim();
        if (form.gender) payload.gender = form.gender;
        if (form.age !== undefined) payload.age = form.age;

        await onSubmit(payload);
    };

    const inputClass = (field: keyof CreatePatientPayload) =>
        `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${validationErrors[field]
            ? 'border-red-400 focus:ring-red-300 bg-red-50'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
        }`;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <svg className="w-5 h-5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Name & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. John Thomas"
                        className={inputClass('name')}
                    />
                    {validationErrors.name && (
                        <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="10-digit number"
                        className={inputClass('mobile')}
                    />
                    {validationErrors.mobile && (
                        <p className="mt-1 text-xs text-red-600">{validationErrors.mobile}</p>
                    )}
                </div>
            </div>

            {/* Email & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="optional"
                        className={inputClass('email')}
                    />
                    {validationErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={`${inputClass('gender')} cursor-pointer`}
                    >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Age */}
            <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                    type="number"
                    name="age"
                    value={form.age ?? ''}
                    onChange={handleChange}
                    min={0}
                    max={150}
                    placeholder="optional"
                    className={inputClass('age')}
                />
                {validationErrors.age && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.age}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Register Patient'
                    )}
                </button>
            </div>
        </form>
    );
};
