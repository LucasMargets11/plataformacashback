import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Link, useLocation } from 'react-router-dom'

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const [open, setOpen] = useState(false)

    // Transparent only on home ("/") when at top of page
    const isTransparent = location.pathname === '/' && !isScrolled

    return (
        <header
            className={
                `sticky top-0 z-50 w-full transition-colors ` +
                `${isTransparent ? 'bg-transparent border-b border-white/10 backdrop-blur' : 'bg-white border-b border-gray-200 shadow-md'}`
            }
        >
            <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center">
                {/* Logo */}
                <Link to="/" className={`mr-6 flex items-center gap-2 font-bold ${isTransparent ? 'text-white' : 'text-[#00264E]'}`}>
                    Dascash
                </Link>

                {/* Navigation - Desktop */}
                <nav className={`ml-auto hidden md:flex items-center gap-8 ${isTransparent ? 'text-white/90' : 'text-[#00264E]/80'}`}>
                    <HeaderLink to="/causas" currentPath={location.pathname} transparent={isTransparent}>Causas</HeaderLink>
                    <HeaderLink to="/how-it-works" currentPath={location.pathname} transparent={isTransparent}>Cómo funciona</HeaderLink>
                    <HeaderLink to="/for-consumers" currentPath={location.pathname} transparent={isTransparent}>Marcas</HeaderLink>
                    <HeaderLink to="/for-business" currentPath={location.pathname} transparent={isTransparent}>Nosotros</HeaderLink>
                </nav>

                {/* Ingresar button */}
                <div className="ml-8 hidden md:block">
                    <Link to="/login">
                        <Button className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow ${isTransparent ? 'bg-white text-[#00264E] hover:bg-white/90' : 'bg-[#00264E] text-white hover:bg-[#00264E]/90'}`}>
                            Ingresar
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setOpen(true)} className={`md:hidden p-2 ${isTransparent ? 'text-white/90 hover:text-white' : 'text-[#00264E]/80 hover:text-[#00264E]'}`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile sheet */}
            {open && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 top-0 h-full w-80 max-w-[80%] bg-[#00264E] text-white shadow-xl">
                        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
                            <Link to="/" className="font-bold" onClick={() => setOpen(false)}>Cashback</Link>
                            <button onClick={() => setOpen(false)} aria-label="Cerrar" className="p-2 text-white/90 hover:text-white">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <nav className="flex flex-col gap-4 p-4 text-white/90">
                            <Link to="/app/home" onClick={() => setOpen(false)} className="hover:text-white">Causas</Link>
                            <Link to="/how-it-works" onClick={() => setOpen(false)} className="hover:text-white">Cómo funciona</Link>
                            <Link to="/for-consumers" onClick={() => setOpen(false)} className="hover:text-white">Marcas</Link>
                            <Link to="/for-business" onClick={() => setOpen(false)} className="hover:text-white">Nosotros</Link>
                            <Link to="/login" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center rounded-full bg-white px-4 py-2 font-semibold text-[#00264E] hover:bg-white/90 shadow">Ingresar</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}

// Small helper for active nav link styles
const HeaderLink: React.FC<{ to: string; currentPath: string; children: React.ReactNode; transparent?: boolean }> = ({ to, currentPath, children, transparent }) => {
    const isActive = currentPath === to || currentPath.startsWith(to)
    const base = 'pb-0.5 border-b-2 border-transparent'
    const palette = transparent
        ? { link: 'text-white/90 hover:text-white', active: 'text-white font-semibold border-white' }
        : { link: 'text-[#00264E]/80 hover:text-[#00264E]', active: 'text-[#00264E] font-semibold border-[#00264E]' }
    const cls = `${base} ${isActive ? palette.active : palette.link}`
    return (
        <Link to={to} className={cls}>
            {children}
        </Link>
    )
}
