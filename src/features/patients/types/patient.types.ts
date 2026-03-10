
export interface Patient {
    _id: string;
    patientId: string;     
    name: string;
    mobile: string;        
    email?: string;
    gender?: string;
    age?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePatientPayload {
    name: string;
    mobile: string;
    email?: string;
    gender?: string;
    age?: number;
}


export interface PatientsListResponse {
    data: Patient[];
    total: number;
    page: number;
    limit: number;
}
