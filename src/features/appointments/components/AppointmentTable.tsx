import type { Appointment } from '../types/appointment.types';

const STATUS_BADGE: Record<string, string> = {
    BOOKED: 'bg-blue-50 text-blue-700 border-blue-200',
    ARRIVED: 'bg-green-50 text-green-700 border-green-200',
};

interface AppointmentTableProps {
    appointments: Appointment[];
    isLoading: boolean;
    error: string | null;
    selectedDate: string;
    // Pagination
    total: number;
    page: number;
    limit: number;
    onPageChange: (p: number) => void;
    onMarkArrived?: (id: string) => void;
}

const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    });

export const AppointmentTable = ({
    appointments,
    isLoading,
    error,
    selectedDate,
    total,
    page,
    limit,
    onPageChange,
    onMarkArrived,
}: AppointmentTableProps) => {
    const totalPages = Math.ceil(total / limit);

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Summary row */}
            {!isLoading && (
                <div className="px-5 py-3 border-b border-gray-50 text-sm text-gray-500 flex items-center gap-1">
                    <span className="font-semibold text-gray-700">{total}</span>
                    <span>appointment{total !== 1 ? 's' : ''}</span>
                    {selectedDate && (
                        <span className="text-gray-400">on {formatDate(selectedDate)}</span>
                    )}
                </div>
            )}

            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient ID</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3 text-gray-400">
                                    <svg className="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span className="text-sm">Loading appointments…</span>
                                </div>
                            </td>
                        </tr>
                    ) : (appointments || []).length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 font-medium text-sm">No appointments found</p>
                                    <p className="text-gray-400 text-xs">
                                        {selectedDate ? `No appointments on ${formatDate(selectedDate)}` : 'Try adjusting your filters'}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        appointments.map(appt => (
                            <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5 font-mono font-semibold text-gray-800">{appt.time}</td>
                                <td className="px-5 py-3.5 font-medium text-gray-900">{appt.patient?.name}</td>
                                <td className="px-5 py-3.5">
                                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                                        {appt.patient?.patientId}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-gray-600">{appt.patient?.mobile}</td>
                                <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">
                                    {appt.purpose || <span className="text-gray-300">—</span>}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_BADGE[appt.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    {appt.status === 'BOOKED' && onMarkArrived && (
                                        <button
                                            onClick={() => onMarkArrived(appt._id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                                        >
                                            Mark Arrived
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange(page - 1)}
                            className="px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >← Prev</button>
                        <span className="px-3 text-xs font-semibold text-blue-600">{page} / {totalPages}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange(page + 1)}
                            className="px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >Next →</button>
                    </div>
                </div>
            )}
        </div>
    );
};
