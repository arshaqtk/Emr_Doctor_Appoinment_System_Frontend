import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 antialiased">
            <Navbar />
            <div className="flex pt-16 h-screen">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
