import type { User } from '../types/admin.types';

interface UserTableProps {
    users: User[];
    onToggleStatus: (id: string, currentIsActive: boolean) => void;
    onUpdateRole: (id: string, newRole: string) => void;
}

export const UserTable = ({ users, onToggleStatus, onUpdateRole }: UserTableProps) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {(users || []).length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No users found.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 text-gray-600">{user.phone || '—'}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => onUpdateRole(user._id, e.target.value)}
                                        className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="DOCTOR">Doctor</option>
                                        <option value="RECEPTIONIST">Receptionist</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-right flex justify-end">
                                    <button
                                        onClick={() => onToggleStatus(user._id, user.isActive)}
                                        className={`text-xs px-3 py-1 border rounded-md transition-colors ${user.isActive
                                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                                            : 'text-green-600 border-green-200 hover:bg-green-50'
                                            }`}
                                    >
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
