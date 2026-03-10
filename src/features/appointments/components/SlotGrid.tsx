import type { Slot } from '../types/appointment.types';

interface SlotGridProps {
    slots: Slot[];
    selectedTime: string;
    isLoading: boolean;
    error: string | null;
    onSelect: (time: string) => void;
}

export const SlotGrid = ({ slots, selectedTime, isLoading, error, onSelect }: SlotGridProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm">Loading available slots…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500 font-medium text-sm">No slots available for this date</p>
                <p className="text-gray-400 text-xs mt-1">Doctor may not work on this day, or all slots are taken</p>
            </div>
        );
    }

    const available = slots.filter(s => s.status === 'available');
    const booked = slots.filter(s => s.status === 'booked');

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-200 border border-green-400 inline-block" />
                    Available ({available.length})
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300 inline-block" />
                    Booked ({booked.length})
                </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {slots.map(slot => {
                    const isAvailable = slot.status === 'available';
                    const isSelected = slot.time === selectedTime;

                    return (
                        <button
                            key={slot.time}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => isAvailable && onSelect(slot.time)}
                            className={`
                                px-2 py-2.5 rounded-lg text-xs font-semibold border transition-all text-center
                                ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                                    : isAvailable
                                        ? 'bg-white text-gray-800 border-green-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'
                                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                }
                            `}
                        >
                            {slot.time}
                            {!isAvailable && (
                                <div className="text-[9px] mt-0.5 text-gray-400">Booked</div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
