import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, UserPlus, Clock, Stethoscope, Users, UsersRound } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth.store'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Patients', icon: UsersRound, path: '/patients' },
    { label: 'Create Patient', icon: UserPlus, path: '/patients/create' },
    { label: 'Book Appointment', icon: Calendar, path: '/appointments/book' },
    { label: 'Doctor Schedule', icon: Clock, path: '/doctors/schedule' },
]

const adminNavItems = [
    { label: 'Manage Doctors', icon: Stethoscope, path: '/admin/doctors' },
    { label: 'Manage Users', icon: Users, path: '/admin/users' },
]

export const Sidebar = () => {
    const { pathname } = useLocation()
    const { user } = useAuthStore()
    const isSuperAdmin = user?.role === 'SUPER_ADMIN'

    const linkClass = (path: string) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === path
            ? 'bg-primary-50 text-primary-700 shadow-sm border-l-2 border-primary-600 pl-3.5'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 transition-all duration-300">
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                        <item.icon size={18} className={pathname === item.path ? 'text-primary-600' : 'text-gray-400'} />
                        {item.label}
                    </Link>
                ))}

                {isSuperAdmin && (
                    <>
                        <div className="pt-4 pb-1 px-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Super Admin</p>
                        </div>
                        {adminNavItems.map((item) => (
                            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                                <item.icon size={18} className={pathname === item.path ? 'text-primary-600' : 'text-gray-400'} />
                                {item.label}
                            </Link>
                        ))}
                    </>
                )}
            </nav>
        </aside>
    )
}
