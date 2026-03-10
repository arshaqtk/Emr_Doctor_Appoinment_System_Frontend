import { useState } from 'react'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>
    isLoading: boolean
    error: string | null
}

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keepLoggedIn, setKeepLoggedIn] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(email, password)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <Input
                id="email"
                type="email"
                label="Email Address"
                icon={Mail}
                placeholder="doctor@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <Input
                id="password"
                label="Password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isPassword
                required
                rightLabel={
                    <a href="#" className="text-sm font-medium text-primary-500 hover:text-primary-600">
                        Forgot?
                    </a>
                }
            />

            <div className="flex items-center">
                <input
                    id="keep-logged-in"
                    type="checkbox"
                    className="w-4 h-4 text-primary-500 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <label htmlFor="keep-logged-in" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
                    Keep me logged in on this device
                </label>
            </div>

            <Button type="submit" isLoading={isLoading} fullWidth>
                Log In to Portal
            </Button>
        </form>
    )
}
