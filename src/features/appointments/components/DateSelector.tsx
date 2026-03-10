interface DateSelectorProps {
    value: string;
    onChange: (date: string) => void;
}

// Returns today's date in YYYY-MM-DD (local time, not UTC)
const todayLocal = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Select Date <span className="text-red-500">*</span>
            </label>
            <input
                type="date"
                value={value}
                min={todayLocal()}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};
