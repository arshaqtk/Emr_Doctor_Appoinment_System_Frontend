import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RootRedirect } from './RootRedirect'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleProtectedRoute } from './RoleProtectedRoute'
import { MainLayout } from '@/layout/MainLayout'
import { ManageDoctorsPage } from '@/features/admin/pages/ManageDoctorsPage'
import { ManageUsersPage } from '@/features/admin/pages/ManageUsersPage'
import { DoctorSchedulePage } from '@/features/doctors/pages/DoctorSchedulePage'
import { PatientListPage } from '@/features/patients/pages/PatientListPage'
import { CreatePatientPage } from '@/features/patients/pages/CreatePatientPage'
import { MyAppointmentsPage } from '@/features/appointments/pages/MyAppointmentsPage'
import { BookAppointmentPage } from '@/features/appointments/pages/BookAppointmentPage'
import { AppointmentsListPage } from '@/features/appointments/pages/AppointmentsListPage'

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
                        element: <RootRedirect />,
                    },
                    {
                        path: 'dashboard',
                        element: <RootRedirect />,
                    },
                    {
                        path: 'patients',
                        element: <PatientListPage />,
                    },
                    {
                        path: 'patients/create',
                        element: <CreatePatientPage />,
                    },
                    {
                        path: 'appointments/my',
                        element: <MyAppointmentsPage />,
                    },
                    {
                        path: 'appointments/book',
                        element: <BookAppointmentPage />,
                    },
                    {
                        path: 'appointments',
                        element: <AppointmentsListPage />,
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
