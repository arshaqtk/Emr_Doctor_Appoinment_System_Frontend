import type { Slot } from '../types/schedule.types';

interface SlotGridProps {
    slots: Slot[];
    isLoading: boolean;
    error: string | null;
}

export const SlotGrid = ({ slots, isLoading, error }: SlotGridProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6 lg:mt-0 lg:ml-6 flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Slots</h3>

            {error && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="py-12 flex justify-center text-gray-500">
                    <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : slots.length === 0 ? (
                <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">No slots available for this date.</p>
                    <p className="text-sm mt-1 px-4">
                        This might not be a working day for the doctor, the schedule hasn't been set,
                        or <strong>all working hours have already passed for today.</strong>
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
                    {slots.map((slot) => {
                        const isAvailable = slot.status === 'available';
                        return (
                            <div
                                key={slot.time}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm transition-all ${isAvailable
                                    ? 'bg-white border-green-200 hover:border-green-400 hover:shadow-md'
                                    : 'bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed'
                                    }`}
                            >
                                <span className={`text-sm font-semibold ${isAvailable ? 'text-gray-800' : 'text-gray-500'}`}>
                                    {slot.time}
                                </span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                                    {slot.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
