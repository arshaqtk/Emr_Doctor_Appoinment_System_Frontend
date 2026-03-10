import type { CreateAppointmentPayload } from '../types/appointment.types';

interface BookingSummaryProps {
    payload: Partial<CreateAppointmentPayload> & { doctorName?: string; patientName?: string };
    isLoading: boolean;
    error: string | null;
    onSubmit: () => void;
    onPurposeChange: (v: string) => void;
    onNotesChange: (v: string) => void;
    purpose: string;
    notes: string;
}

export const AppointmentForm = ({
    payload,
    isLoading,
    error,
    onSubmit,
    onPurposeChange,
    onNotesChange,
    purpose,
    notes,
}: BookingSummaryProps) => {
    const canSubmit = payload.doctorId && payload.date && payload.time && payload.patientType;

    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Booking Summary</h3>

            {/* Read-only summary */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs text-gray-500 font-medium">Doctor</p>
                    <p className="font-semibold text-gray-800">{payload.doctorName || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">Patient</p>
                    <p className="font-semibold text-gray-800">{payload.patientName || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">Date</p>
                    <p className="font-semibold text-gray-800">
                        {payload.date
                            ? new Date(payload.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">Time Slot</p>
                    <p className="font-semibold text-gray-800">{payload.time || '—'}</p>
                </div>
            </div>

            {/* Purpose */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose of Visit</label>
                <input
                    type="text"
                    value={purpose}
                    onChange={e => onPurposeChange(e.target.value)}
                    placeholder="e.g. General checkup, Fever"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                <textarea
                    value={notes}
                    onChange={e => onNotesChange(e.target.value)}
                    placeholder="Optional notes"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                type="button"
                disabled={!canSubmit || isLoading}
                onClick={onSubmit}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Booking…
                    </>
                ) : (
                    'Confirm Appointment'
                )}
            </button>
        </div>
    );
};
