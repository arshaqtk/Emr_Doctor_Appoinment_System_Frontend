import { Link, useLocation } from 'react-router-dom'
import { Calendar, UserPlus, Clock, Stethoscope, Users, UsersRound, CalendarCheck, ClipboardList } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth.store'


// Receptionist / Admin visible items
const staffNavItems = [
    { label: 'Booked Appointments', icon: ClipboardList, path: '/appointments' },
    { label: 'Book Appointment', icon: Calendar, path: '/appointments/book' },
    { label: 'Patients', icon: UsersRound, path: '/patients' },
    { label: 'Create Patient', icon: UserPlus, path: '/patients/create' },
    { label: 'Doctor Schedule', icon: Clock, path: '/doctors/schedule' },
]

// Doctor-only items
const doctorNavItems = [
    { label: 'My Appointments', icon: CalendarCheck, path: '/appointments/my' },
    { label: 'My Schedule', icon: Clock, path: '/doctors/schedule' },
]

// Super Admin-only items
const adminNavItems = [
    { label: 'Manage Doctors', icon: Stethoscope, path: '/admin/doctors' },
    { label: 'Manage Users', icon: Users, path: '/admin/users' },
]

export const Sidebar = () => {
    const { pathname } = useLocation()
    const { user } = useAuthStore()
    const isDoctor = user?.role === 'DOCTOR'
    const isSuperAdmin = user?.role === 'SUPER_ADMIN'

    const linkClass = (path: string) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === path
            ? 'bg-primary-50 text-primary-700 shadow-sm border-l-2 border-primary-600 pl-3.5'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`

    const NavLink = ({ item }: { item: { label: string; icon: any; path: string } }) => (
        <Link to={item.path} className={linkClass(item.path)}>
            <item.icon size={18} className={pathname === item.path ? 'text-primary-600' : 'text-gray-400'} />
            {item.label}
        </Link>
    )

    const SectionLabel = ({ label }: { label: string }) => (
        <div className="pt-4 pb-1 px-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        </div>
    )

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-1">
                {/* Doctor view — only doctor-relevant links */}
                {isDoctor && (
                    <>
                        {doctorNavItems.map(item => <NavLink key={item.path} item={item} />)}
                    </>
                )}

                {/* Staff view — receptionist, super admin */}
                {!isDoctor && (
                    <>
                        {staffNavItems.map(item => <NavLink key={item.path} item={item} />)}
                    </>
                )}

                {/* Super Admin extras */}
                {isSuperAdmin && (
                    <>
                        <SectionLabel label="Super Admin" />
                        {adminNavItems.map(item => <NavLink key={item.path} item={item} />)}
                    </>
                )}
            </nav>
        </aside>
    )
}
