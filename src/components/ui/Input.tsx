import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon?: LucideIcon
    error?: string
    rightLabel?: React.ReactNode
    isPassword?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon: Icon, error, rightLabel, isPassword, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        return (
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label
                        className="block text-sm font-semibold text-gray-800"
                        htmlFor={props.id}
                    >
                        {label}
                    </label>
                    {rightLabel}
                </div>
                <div className="relative">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Icon size={18} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 ${isPassword ? 'tracking-widest' : ''} ${error ? 'border-red-300 focus:ring-red-500' : ''} ${className}`}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
