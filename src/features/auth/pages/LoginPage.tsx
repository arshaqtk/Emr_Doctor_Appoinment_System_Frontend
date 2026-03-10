import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { authService } from '../services/auth.api'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
    const { login, setError, setLoading, error, isLoading } = useAuthStore()
    const navigate = useNavigate()

    const handleLogin = async (email: string, password: string) => {
        setLoading(true)
        setError(null)

        try {
            const data = await authService.login({ email, password })
            login(data.user)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            {/* Top Navigation */}
            <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            <path d="M12 11v4" />
                            <path d="M10 13h4" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">MedConnect</span>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex w-full max-w-[960px] overflow-hidden">

                    {/* Left Side — Illustration Panel */}
                    <div className="hidden md:flex flex-col w-[45%] bg-[#F8FAFC] p-10 items-center justify-center text-center">
                        <div className="w-full max-w-[280px] rounded-2xl overflow-hidden mb-8">
                            <img
                                src="/doctor-illustration.png"
                                alt="Doctor illustration"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-3">
                            Empowering Healthcare<br />Professionals
                        </h2>
                        <p className="text-[14px] text-gray-500 leading-relaxed max-w-[300px]">
                            Access patient records, schedule appointments, and manage clinical workflows in one unified platform.
                        </p>
                    </div>

                    {/* Right Side — Login Form */}
                    <div className="w-full md:w-[55%] p-10 md:p-12 flex flex-col justify-center bg-white">
                        <div className="max-w-sm w-full mx-auto">
                            <h1 className="text-[28px] font-bold text-gray-900 mb-1.5">Welcome Back</h1>
                            <p className="text-gray-500 text-[15px] mb-8">
                                Please enter your medical credentials to log in.
                            </p>

                            <LoginForm
                                onSubmit={handleLogin}
                                isLoading={isLoading}
                                error={error}
                            />

                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-500">
                                    Don't have an institutional account?{' '}
                                    <a href="#" className="font-semibold text-primary-500 hover:text-primary-600">
                                        Contact Administrator
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-5 text-center text-xs text-gray-400 space-y-1.5">
                <p>© 2024 MedConnect Health Systems. All rights reserved. HIPAA Compliant Platform.</p>
                <div className="flex justify-center gap-4">
                    <a href="#" className="hover:text-gray-600 underline decoration-gray-300 underline-offset-2">Security Standards</a>
                    <a href="#" className="hover:text-gray-600 underline decoration-gray-300 underline-offset-2">Terms of Service</a>
                </div>
            </footer>
        </div>
    )
}
