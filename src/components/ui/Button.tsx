import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    isLoading?: boolean
    fullWidth?: boolean
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = 'py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
        outline: 'border border-gray-200 hover:bg-gray-50 text-gray-700',
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Please wait...</span>
                </div>
            ) : (
                children
            )}
        </button>
    )
}
