import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientTable } from '../components/PatientTable';
import { patientService } from '../services/patient.api';
import type { Patient } from '../types/patient.types';

const LIMIT = 20;

export const PatientListPage = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce search — reset page when query changes
    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setPage(1);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await patientService.getPatients(debouncedQuery || undefined, page, LIMIT);
            setPatients(result.data);
            setTotal(result.total);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load patients.');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedQuery, page]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {total > 0 ? `${total} patient${total !== 1 ? 's' : ''} registered` : 'Manage registered patients'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/patients/create')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Patient
                </button>
            </div>

            <PatientTable
                patients={patients}
                isLoading={isLoading}
                error={error}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                total={total}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
            />
        </div>
    );
};
