import type { Patient } from '../types/patient.types';

interface PatientTableProps {
    patients: Patient[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    total: number;
    page: number;
    limit: number;
    onPageChange: (p: number) => void;
}

export const PatientTable = ({
    patients,
    isLoading,
    error,
    searchQuery,
    onSearchChange,
    total,
    page,
    limit,
    onPageChange,
}: PatientTableProps) => {
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name, mobile or Patient ID..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Patient ID</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Name</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Mobile</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Email</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Gender</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Age</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-gray-500">
                                        <svg className="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span className="text-sm">Loading patients…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (patients || []).length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="font-medium text-gray-500 text-sm">
                                            {searchQuery ? `No patients found for "${searchQuery}"` : 'No patients registered yet'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            patients.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                                            {p.patientId}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{p.mobile}</td>
                                    <td className="px-5 py-3.5 text-gray-500">{p.email || <span className="text-gray-300">—</span>}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{p.gender || <span className="text-gray-300">—</span>}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{p.age ?? <span className="text-gray-300">—</span>}</td>

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
                            >
                                ← Prev
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold text-blue-600">{page} / {totalPages}</span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => onPageChange(page + 1)}
                                className="px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
