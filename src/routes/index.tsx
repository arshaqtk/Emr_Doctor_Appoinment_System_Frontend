import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleProtectedRoute } from './RoleProtectedRoute'
import { MainLayout } from '@/layout/MainLayout'
import { ManageDoctorsPage } from '@/features/admin/pages/ManageDoctorsPage'
import { ManageUsersPage } from '@/features/admin/pages/ManageUsersPage'
import { DoctorSchedulePage } from '@/features/doctors/pages/DoctorSchedulePage'

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/dashboard" replace />,
                    },
                    {
                        path: 'dashboard',
                        element: <DashboardPage />,
                    },
                    {
                        path: 'patients/create',
                        element: <div className="p-8"><h1 className="text-2xl font-bold">Create Patient</h1></div>,
                    },
                    {
                        path: 'appointments/book',
                        element: <div className="p-8"><h1 className="text-2xl font-bold">Book Appointment</h1></div>,
                    },
                    {
                        path: 'doctors/schedule',
                        element: <DoctorSchedulePage />,
                    },
                    // Super Admin protected routes
                    {
                        element: <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
                        children: [
                            {
                                path: 'admin/doctors',
                                element: <ManageDoctorsPage />,
                            },
                            {
                                path: 'admin/users',
                                element: <ManageUsersPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
])

