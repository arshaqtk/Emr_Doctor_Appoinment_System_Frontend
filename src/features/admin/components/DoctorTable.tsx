import type { DoctorProfile } from '../types/admin.types';

interface DoctorTableProps {
    doctors: DoctorProfile[];
    onToggleActive: (id: string, currentIsActive: boolean) => void;
    onViewDetails: (doctor: DoctorProfile) => void;
    onEdit: (doctor: DoctorProfile) => void;
}

export const DoctorTable = ({ doctors, onToggleActive, onViewDetails, onEdit }: DoctorTableProps) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Specialization</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Department</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Experience</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Qualification</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Fee</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Duration</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Hours</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {doctors.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                                No doctors found.
                            </td>
                        </tr>
                    ) : (
                        doctors.map((doctor) => {
                            const userName =
                                typeof doctor.user === 'object'
                                    ? doctor.user.name
                                    : 'Unknown';

                            return (
                                <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{userName}</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.specialization}</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.department}</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.experience} yrs</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.qualification}</td>
                                    <td className="px-6 py-4 text-gray-600">₹{doctor.consultationFee}</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.slotDuration} min</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {doctor.workingHours?.start} – {doctor.workingHours?.end}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${doctor.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {doctor.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-right flex justify-end gap-3">
                                        <button
                                            onClick={() => onToggleActive(doctor._id, doctor.isActive)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {doctor.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => onEdit(doctor)}
                                            className="text-xs text-gray-600 hover:text-gray-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onViewDetails(doctor)}
                                            className="text-xs text-gray-600 hover:text-gray-800"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
