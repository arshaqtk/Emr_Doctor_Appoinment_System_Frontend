import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { DoctorProfile, CreateDoctorProfilePayload, User } from '../types/admin.types';
import { adminApi } from '../services/admin.api';
import { DoctorTable } from '../components/DoctorTable';
import { DoctorForm } from '../components/DoctorForm';

export const ManageDoctorsPage = () => {
    const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<DoctorProfile | null>(null);
    const [viewingDoctor, setViewingDoctor] = useState<DoctorProfile | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [docsData, usersData] = await Promise.all([
                adminApi.getDoctors(),
                adminApi.getUsers()
            ]);
            setDoctors(docsData || []);
            setUsers(usersData || []);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggleActive = async (id: string, currentIsActive: boolean) => {
        try {
            await adminApi.updateAvailability(id, { isActive: !currentIsActive } as any);
            loadData();
        } catch (err: any) {
            toast.error('Failed to update status');
        }
    };

    const handleSubmitForm = async (payload: CreateDoctorProfilePayload) => {
        try {
            setIsLoading(true);
            if (editingDoctor) {
                await adminApi.updateDoctor(editingDoctor._id, payload);
                await adminApi.updateAvailability(editingDoctor._id, {
                    slotDuration: payload.slotDuration,
                    workingHours: payload.workingHours,
                    breakTimes: payload.breakTimes,
                    availableDays: payload.availableDays
                });
            } else {
                await adminApi.createDoctorProfile(payload);
            }
            setShowForm(false);
            setEditingDoctor(null);
            loadData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || `Failed to ${editingDoctor ? 'update' : 'create'} doctor profile`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (doctor: DoctorProfile) => {
        setEditingDoctor(doctor);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingDoctor(null);
    };

    // Filter users to only unassigned DOCTOR accounts
    const assignedUserIds = new Set(doctors.map(d => typeof d.user === 'object' ? d.user._id : d.user));
    const availableDoctorUsers = users.filter(u => u.role === 'DOCTOR' && !assignedUserIds.has(u._id));
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
                    <p className="text-gray-500 mt-1">Super Admin control for doctors and practitioners</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 font-semibold transition-colors focus:ring-4 focus:ring-blue-100"
                    >
                        + Add Doctor Profile
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {showForm ? (
                <DoctorForm
                    initialData={editingDoctor ? {
                        ...editingDoctor,
                        user: typeof editingDoctor.user === 'object' ? editingDoctor.user._id : editingDoctor.user
                    } : undefined}
                    availableUsers={availableDoctorUsers}
                    onSubmit={handleSubmitForm}
                    onCancel={handleCloseForm}
                    isLoading={isLoading}
                />
            ) : (
                <>
                    {isLoading ? (
                        <div className="py-12 flex justify-center text-gray-500 bg-white rounded-lg border border-gray-100">
                            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <DoctorTable
                            doctors={doctors}
                            onToggleActive={handleToggleActive}
                            onViewDetails={(doc) => setViewingDoctor(doc)}
                            onEdit={handleEdit}
                        />
                    )}
                </>
            )}

            {viewingDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Doctor Profile Details</h3>
                            <button onClick={() => setViewingDoctor(null)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-semibold text-gray-600">Name:</span> {typeof viewingDoctor.user === 'object' ? viewingDoctor.user.name : viewingDoctor.user}</div>
                                <div><span className="font-semibold text-gray-600">Email:</span> {typeof viewingDoctor.user === 'object' ? viewingDoctor.user.email : 'N/A'}</div>
                                <div><span className="font-semibold text-gray-600">Phone:</span> {(typeof viewingDoctor.user === 'object' ? viewingDoctor.user.phone : 'N/A') || 'N/A'}</div>
                                <div><span className="font-semibold text-gray-600">Department:</span> {viewingDoctor.department}</div>
                                <div><span className="font-semibold text-gray-600">Specialization:</span> {viewingDoctor.specialization}</div>
                                <div><span className="font-semibold text-gray-600">Qualification:</span> {viewingDoctor.qualification}</div>
                                <div><span className="font-semibold text-gray-600">Experience:</span> {viewingDoctor.experience} Years</div>
                                <div><span className="font-semibold text-gray-600">Fee:</span> ₹{viewingDoctor.consultationFee}</div>
                                <div><span className="font-semibold text-gray-600">Slot Duration:</span> {viewingDoctor.slotDuration} min</div>
                                <div><span className="font-semibold text-gray-600">Working Hours:</span> {viewingDoctor.workingHours?.start} - {viewingDoctor.workingHours?.end}</div>
                                <div className="col-span-2">
                                    <span className="font-semibold text-gray-600">Available Days: </span>
                                    {viewingDoctor.availableDays?.join(', ')}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setViewingDoctor(null)} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
