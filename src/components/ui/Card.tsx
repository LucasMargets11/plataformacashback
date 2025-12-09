import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => {
    return <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`} {...props} />
}
