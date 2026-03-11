import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { User, CreateUserPayload } from '../types/admin.types';
import { adminApi } from '../services/admin.api';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';

export const ManageUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminApi.getUsers();
            setUsers(data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleToggleStatus = async (id: string, currentIsActive: boolean) => {
        try {
            await adminApi.patchUser(id, { isActive: !currentIsActive });
            loadUsers();
        } catch (err: any) {
            toast.error('Failed to update status');
        }
    };

    const handleUpdateRole = async (id: string, newRole: string) => {
        try {
            await adminApi.patchUser(id, { role: newRole as Exclude<User['role'], 'SUPER_ADMIN'> });
            loadUsers();
        } catch (err: any) {
            toast.error('Failed to update role');
        }
    };

    const handleCreateUser = async (payload: CreateUserPayload, role: 'DOCTOR' | 'RECEPTIONIST') => {
        try {
            setIsLoading(true);
            if (role === 'DOCTOR') {
                await adminApi.createDoctorUser(payload);
            } else {
                await adminApi.createReceptionist(payload);
            }
            setShowForm(false);
            loadUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                    <p className="text-gray-500 mt-1">Super Admin control for system users and roles</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 font-semibold transition-colors focus:ring-4 focus:ring-blue-100"
                    >
                        + Create User
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
                <UserForm
                    onSubmit={handleCreateUser}
                    onCancel={() => setShowForm(false)}
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
                        <UserTable
                            users={users}
                            onToggleStatus={handleToggleStatus}
                            onUpdateRole={handleUpdateRole}
                        />
                    )}
                </>
            )}
        </div>
    );
};
