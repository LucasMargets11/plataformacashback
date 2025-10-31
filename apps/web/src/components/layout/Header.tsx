import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
            }`}>
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 md:px-8 lg:px-10 h-16 md:h-18">
                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    Cashback
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden lg:flex items-center space-x-8">
                    <Link to="/how-it-works" className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        Cómo funciona
                    </Link>
                    <Link to="/for-consumers" className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        Consumidores
                    </Link>
                    <Link to="/for-teams" className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        Causas
                    </Link>
                    <Link to="/for-merchants" className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        Comerciantes
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 hidden sm:block">
                        Log In
                    </Link>
                    <Link to="/signup">
                        <Button className="h-10 px-6 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200">
                            Sign Up
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button - Placeholder */}
                <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    )
}
