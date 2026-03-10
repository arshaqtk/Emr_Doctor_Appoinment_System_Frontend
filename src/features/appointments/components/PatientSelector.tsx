import { useState, useRef, useEffect } from 'react';
import { patientService } from '@/features/patients/services/patient.api';
import type { Patient } from '@/features/patients/types/patient.types';

interface PatientSelectorProps {
    patientType: 'EXISTING' | 'NEW';
    selectedPatient: Patient | null;
    onPatientTypeChange: (type: 'EXISTING' | 'NEW') => void;
    onPatientSelect: (patient: Patient | null) => void;
    newPatientData: { name: string; mobile: string; email?: string };
    onNewPatientChange: (field: 'name' | 'mobile' | 'email', value: string) => void;
}

export const PatientSelector = ({
    patientType,
    selectedPatient,
    onPatientTypeChange,
    onPatientSelect,
    newPatientData,
    onNewPatientChange,
}: PatientSelectorProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Patient[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const patients = await patientService.searchPatients(query);
                setResults(patients);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handlePatientPick = (p: Patient) => {
        onPatientSelect(p);
        setQuery('');
        setShowDropdown(false);
    };

    return (
        <div className="space-y-3">
            {/* Toggle */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Patient Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    {(['EXISTING', 'NEW'] as const).map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => { onPatientTypeChange(type); onPatientSelect(null); setQuery(''); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${patientType === type
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                                }`}
                        >
                            {type === 'EXISTING' ? 'Existing Patient' : 'New Patient'}
                        </button>
                    ))}
                </div>
            </div>

            {patientType === 'EXISTING' ? (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Search Patient <span className="text-red-500">*</span>
                    </label>

                    {/* Selected patient chip */}
                    {selectedPatient ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div>
                                <p className="text-sm font-semibold text-blue-900">{selectedPatient.name}</p>
                                <p className="text-xs text-blue-600">{selectedPatient.patientId} · {selectedPatient.mobile}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onPatientSelect(null)}
                                className="text-blue-400 hover:text-red-500 transition-colors text-lg leading-none"
                            >✕</button>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Search by name, mobile or Patient ID…"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {isSearching && (
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                            </div>

                            {showDropdown && query.length >= 2 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                                    {results.length === 0 && !isSearching ? (
                                        <div className="px-4 py-3 text-sm text-gray-400">No patients found</div>
                                    ) : (
                                        results.map(p => (
                                            <button
                                                key={p._id}
                                                type="button"
                                                onClick={() => handlePatientPick(p)}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.patientId} · {p.mobile}</p>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* NEW patient inline fields */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newPatientData.name}
                            onChange={e => onNewPatientChange('name', e.target.value)}
                            placeholder="Patient full name"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={newPatientData.mobile}
                            onChange={e => onNewPatientChange('mobile', e.target.value)}
                            maxLength={10}
                            placeholder="10-digit number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email (optional)</label>
                        <input
                            type="email"
                            value={newPatientData.email}
                            onChange={e => onNewPatientChange('email', e.target.value)}
                            placeholder="optional"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
