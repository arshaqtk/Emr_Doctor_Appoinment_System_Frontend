import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Doctor {
    _id: string;
    department: string;
    specialization: string;
    user: { name: string };
}

interface DoctorSelectorProps {
    selectedDoctorId: string;
    onSelect: (doctorId: string) => void;
}

export const DoctorSelector = ({ selectedDoctorId, onSelect }: DoctorSelectorProps) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/doctors?limit=100')
            .then(res => setDoctors(res.data.data ?? []))
            .catch(() => setError('Failed to load doctors'))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Select Doctor <span className="text-red-500">*</span>
            </label>
            {error && <p className="text-xs text-red-500 mb-1">{error}</p>}
            <select
                value={selectedDoctorId}
                onChange={e => onSelect(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
                <option value="">
                    {isLoading ? 'Loading doctors…' : '— Select a doctor —'}
                </option>
                {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                        Dr. {doc.user?.name} · {doc.department} ({doc.specialization})
                    </option>
                ))}
            </select>
        </div>
    );
};
