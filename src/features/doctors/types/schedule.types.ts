export interface Slot {
    time: string;
    status: 'available' | 'booked';
}

export interface BreakTime {
    start: string;
    end: string;
}

export interface WorkingHours {
    start: string;
    end: string;
}

export interface DoctorSchedule {
    _id: string;
    slotDuration: number;
    workingHours: WorkingHours;
    availableDays: string[];
    breakTimes: BreakTime[];
}

export interface UpdateSchedulePayload {
    slotDuration: number;
    workingHours: WorkingHours;
    availableDays: string[];
    breakTimes: BreakTime[];
}


export interface DoctorOption {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    } | string;
    department: string;
}
