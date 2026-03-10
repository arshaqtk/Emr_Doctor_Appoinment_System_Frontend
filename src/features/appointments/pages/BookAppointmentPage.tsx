import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { appointmentService } from '../services/appointment.api';
import { PatientSelector } from '../components/PatientSelector';
import { DoctorSelector } from '../components/DoctorSelector';
import { DateSelector } from '../components/DateSelector';
import { SlotGrid } from '../components/SlotGrid';
import { AppointmentForm } from '../components/AppointmentForm';
import type { Slot, CreateAppointmentPayload } from '../types/appointment.types';
import type { Patient } from '@/features/patients/types/patient.types';

// Step indicator
const STEPS = ['Patient', 'Doctor & Date', 'Slot', 'Confirm'];

const StepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i < current ? 'bg-blue-600 border-blue-600 text-white'
                        : i === current ? 'bg-white border-blue-600 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                        {i < current ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold ${i === current ? 'text-blue-600' : i < current ? 'text-blue-500' : 'text-gray-400'}`}>
                        {label}
                    </span>
                </div>
                {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mb-4 ${i < current ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
            </div>
        ))}
    </div>
);

export const BookAppointmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // ── Patient ────────────────────────────────────────────────────────────────
    const [patientType, setPatientType] = useState<'EXISTING' | 'NEW'>('EXISTING');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [newPatientData, setNewPatientData] = useState({ name: '', mobile: '', email: '' });

    // ── Doctor & Date ──────────────────────────────────────────────────────────
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // ── Slots ──────────────────────────────────────────────────────────────────
    const [slots, setSlots] = useState<Slot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState('');

    // ── Submit ─────────────────────────────────────────────────────────────────
    const [purpose, setPurpose] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // ── Step logic ─────────────────────────────────────────────────────────────
    const patientReady = patientType === 'EXISTING'
        ? !!selectedPatient
        : !!newPatientData.name.trim() && !!newPatientData.mobile.trim();

    const step = !patientReady ? 0
        : !selectedDoctorId || !selectedDate ? 1
            : !selectedTime ? 2
                : 3;

    // ── Fetch slots when doctor + date both set ────────────────────────────────
    const fetchSlots = useCallback(async () => {
        if (!selectedDoctorId || !selectedDate) return;
        setSlotsLoading(true);
        setSlotsError(null);
        setSlots([]);
        setSelectedTime('');
        try {
            const data = await appointmentService.getSlots(selectedDoctorId, selectedDate);
            setSlots(data);
        } catch (err: any) {
            setSlotsError(err.response?.data?.message || 'Failed to fetch slots');
        } finally {
            setSlotsLoading(false);
        }
    }, [selectedDoctorId, selectedDate]);

    useEffect(() => { fetchSlots(); }, [fetchSlots]);

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);
        setSubmitError(null);

        const payload: CreateAppointmentPayload = {
            doctorId: selectedDoctorId,
            date: selectedDate,
            time: selectedTime,
            patientType,
            purpose: purpose.trim() || undefined,
            notes: notes.trim() || undefined,
        };

        if (patientType === 'EXISTING' && selectedPatient) {
            payload.patientId = selectedPatient.patientId; // "PAT-XXXX"
        } else {
            payload.patientData = {
                name: newPatientData.name.trim(),
                mobile: newPatientData.mobile.trim(),
                email: newPatientData.email.trim() || undefined,
            };
        }

        try {
            await appointmentService.bookAppointment(payload);
            navigate('/appointments', { state: { successMsg: 'Appointment booked successfully!' } });
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const patientName = patientType === 'EXISTING'
        ? selectedPatient?.name ?? ''
        : newPatientData.name;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
                <p className="text-gray-500 text-sm mt-0.5">Fill in each step to schedule an appointment</p>
            </div>

            <StepIndicator current={step} />

            <div className="space-y-6">
                {/* ── Step 0: Patient ─────────────────────────────────────────── */}
                <section className={`bg-white rounded-xl border shadow-sm p-6 transition-opacity ${!patientReady ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-100 opacity-80'}`}>
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                        Patient
                    </h2>
                    <PatientSelector
                        patientType={patientType}
                        selectedPatient={selectedPatient}
                        onPatientTypeChange={t => { setPatientType(t); setSelectedPatient(null); }}
                        onPatientSelect={setSelectedPatient}
                        newPatientData={newPatientData}
                        onNewPatientChange={(field, value) => setNewPatientData(prev => ({ ...prev, [field]: value }))}
                    />
                </section>

                {/* ── Step 1: Doctor & Date ────────────────────────────────────── */}
                <section className={`bg-white rounded-xl border shadow-sm p-6 transition-opacity ${!patientReady ? 'opacity-40 pointer-events-none' : ''
                    } ${patientReady && (!selectedDoctorId || !selectedDate) ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-100'}`}>
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                        Doctor &amp; Date
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <DoctorSelector
                            selectedDoctorId={selectedDoctorId}
                            onSelect={id => { setSelectedDoctorId(id); setSelectedTime(''); }}
                        />
                        <DateSelector
                            value={selectedDate}
                            onChange={d => { setSelectedDate(d); setSelectedTime(''); }}
                        />
                    </div>
                </section>

                {/* ── Step 2: Slots ────────────────────────────────────────────── */}
                <section className={`bg-white rounded-xl border shadow-sm p-6 transition-opacity ${(!patientReady || !selectedDoctorId || !selectedDate) ? 'opacity-40 pointer-events-none' : ''
                    } ${patientReady && selectedDoctorId && selectedDate && !selectedTime ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-100'}`}>
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                        Select Time Slot
                    </h2>
                    <SlotGrid
                        slots={slots}
                        selectedTime={selectedTime}
                        isLoading={slotsLoading}
                        error={slotsError}
                        onSelect={setSelectedTime}
                    />
                </section>

                {/* ── Step 3: Confirm ──────────────────────────────────────────── */}
                <section className={`transition-opacity ${step < 3 ? 'opacity-40 pointer-events-none' : ''
                    }`}>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                        <h2 className="text-base font-bold text-gray-800">Confirm Booking</h2>
                    </div>
                    <AppointmentForm
                        payload={{
                            doctorId: selectedDoctorId,
                            doctorName: selectedDoctorId,
                            patientName,
                            date: selectedDate,
                            time: selectedTime,
                            patientType,
                        }}
                        purpose={purpose}
                        notes={notes}
                        onPurposeChange={setPurpose}
                        onNotesChange={setNotes}
                        isLoading={isSubmitting}
                        error={submitError}
                        onSubmit={handleSubmit}
                    />
                </section>
            </div>
        </div>
    );
};
