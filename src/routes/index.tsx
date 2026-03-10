import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '@/layout/MainLayout'

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
                        element: <div className="p-8"><h1 className="text-2xl font-bold">Doctor Schedule</h1></div>,
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
