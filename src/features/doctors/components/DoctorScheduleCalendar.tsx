interface DoctorScheduleCalendarProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export const DoctorScheduleCalendar = ({ selectedDate, onSelectDate }: DoctorScheduleCalendarProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">View Specific Date</h3>
            <p className="text-sm text-gray-500 mb-4">Select a date to view generated slots and availability.</p>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
        </div>
    );
};
