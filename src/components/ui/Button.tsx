import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ className = '', variant = 'primary', ...props }) => {
    const base =
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    const styles =
        variant === 'secondary'
            ? 'bg-white text-brand-navy-900 border border-slate-200 hover:bg-white/90 focus:ring-brand-blue-600 focus:ring-offset-white'
            : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700 focus:ring-brand-blue-600 focus:ring-offset-white'

    return <button className={`${base} ${styles} ${className}`} {...props} />
}
