interface AppointmentFiltersProps {
    selectedDate: string;
    statusFilter: string;
    onDateChange: (date: string) => void;
    onStatusChange: (status: string) => void;
    onClear: () => void;
}

export const AppointmentFilters = ({
    selectedDate,
    statusFilter,
    onDateChange,
    onStatusChange,
    onClear,
}: AppointmentFiltersProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => onDateChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="sm:w-44">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Status</label>
                <select
                    value={statusFilter}
                    onChange={e => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">All</option>
                    <option value="BOOKED">Booked</option>
                    <option value="ARRIVED">Arrived</option>
                </select>
            </div>
            <button
                onClick={onClear}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Clear
            </button>
        </div>
    );
};
