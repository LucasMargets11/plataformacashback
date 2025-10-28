import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ className = '', variant = 'primary', ...props }) => {
    const base =
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'
    const styles =
        variant === 'secondary'
            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400'

    return <button className={`${base} ${styles} ${className}`} {...props} />
}
