import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from '../components/PatientForm';
import { patientService } from '../services/patient.api';
import type { CreatePatientPayload } from '../types/patient.types';

export const CreatePatientPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: CreatePatientPayload) => {
        try {
            setIsLoading(true);
            setError(null);
            await patientService.createPatient(data);
            navigate('/patients');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to register patient. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/patients')}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Patients
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Register New Patient</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Fill in the details below to add a new patient to the system.
                </p>
            </div>

            <PatientForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};
