import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import BrandCarousel from '../components/BrandCarousel'

// Brand logos are auto-detected as /public/brands/1..N.png; carousel will hide missing files.

// How it works steps
const steps = [
    {
        icon: '💳',
        title: '1. Conecta tu cuenta',
        description: 'Vincula de forma segura tu tarjeta de débito o crédito. Es rápido, fácil y seguro.',
    },
    {
        icon: '🛍️',
        title: '2. Compra en tiendas',
        description: 'Usa tu tarjeta vinculada en cientos de marcas y tiendas locales que ya conoces y amás.',
    },
    {
        icon: '🏆',
        title: '3. Gana Cashback',
        description: 'Recibe cashback automáticamente para tu causa y apoya a tu equipo sin esfuerzo.',
    },
]

// Audience blocks
const audienceBlocks = [
    {
        title: 'Para Consumidores',
        description: 'Obtén reembolsos en efectivo por tus compras diarias sin cupones ni códigos. Simplicidad y ahorro en un solo lugar.',
        link: '/for-consumers',
    },
    {
        title: 'Para Equipos',
        description: 'Recaudá fondos para tu club o equipo sin esfuerzo. Cada compra de tus miembros se convierte en una donación.',
        link: '/for-teams',
    },
    {
        title: 'Para Comercios',
        description: 'Atrae a nuevos clientes leales y aumenta tus ventas. Convertite en el lugar preferido de la comunidad.',
        link: '/for-merchants',
    },
]

// Testimonials
const testimonials = [
    {
        quote: 'Recaudar fondos siempre fue un desafío. Ahora, con las compras diarias de nuestros miembros, alcanzamos nuestras metas más rápido que nunca.',
        name: 'Carlos Rodríguez',
        role: 'Capitán del Equipo',
        avatar: '👨‍💼',
    },
    {
        quote: 'Me encanta recibir cashback sin tener que pensar en ello. Es increíblemente fácil, ¡y además ayuda al equipo de mi hija!',
        name: 'Ana Gómez',
        role: 'Compradora',
        avatar: '👩‍🦰',
    },
    {
        quote: 'Finalmente una plataforma que conecta nuestras metas como equipo con los hábitos de compra de nuestra comunidad. ¡Es un ganar-ganar!',
        name: 'Javier Fernández',
        role: 'Tesorero del Club',
        avatar: '👨‍🏫',
    },
]

export default function IndexPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="pt-14 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10 text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight">
                        Ganen fondos comprando<br />
                        <span className="text-blue-600">donde ya compran</span>
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        La forma más fácil para que los equipos recauden dinero y los compradores obtengan un reembolso, simplemente comprando en sus tiendas favoritas.
                    </p>
                    <div className="mt-6">
                        <Link to="/signup">
                            <Button className="h-12 px-7 md:px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-3xl transition-all duration-200 hover:shadow-lg">
                                Crear cuenta
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Logos Section - Auto-scrolling carousel (full-bleed) */}
            <section className="pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-6 lg:pb-6 bg-blue-50 overflow-x-hidden">
                {/* Eyebrow + Title within container */}
                <div className="max-w-[1280px] mx-auto px-6 md:px-8">
                    <p className="text-center text-[11px] md:text-xs tracking-[0.12em] uppercase text-gray-500 font-semibold mb-2">
                        COMPRA EN TUS MARCAS FAVORITAS
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-4 md:mb-5">
                        Ganá cashback con más de 800 marcas
                    </h3>
                </div>
                {/* Full-bleed carousel breaks out of container to touch page edges */}
                <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-x-hidden">
                    <BrandCarousel speedMs={28000} />
                </div>
                {/* CTA back inside container */}
                <div className="max-w-[1280px] mx-auto px-6 md:px-8">
                    <div className="mt-2 text-center">
                        <Link to="/for-consumers" className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium">
                            Ver todas las marcas →
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-14 md:py-18 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-16 lg:mb-20 leading-[1.15]">
                        ¿Cómo funciona?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="text-center p-6 md:p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200"
                            >
                                <div className="text-6xl mb-6">{step.icon}</div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 leading-[1.25]">
                                    {step.title}
                                </h3>
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Audience Blocks Section */}
            <section className="py-14 md:py-18 lg:py-24 bg-gray-50">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {audienceBlocks.map((block, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-2xl p-7 md:p-8 hover:shadow-lg transition-all duration-200 group"
                            >
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 leading-[1.25]">
                                    {block.title}
                                </h3>
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                                    {block.description}
                                </p>
                                <Link
                                    to={block.link}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group-hover:underline transition-colors duration-200"
                                >
                                    Aprender más
                                    <span className="ml-1">→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-14 md:py-18 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-16 lg:mb-20 leading-[1.15]">
                        Lo que nuestra comunidad dice
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-7 md:p-8 hover:bg-white hover:shadow-lg transition-all duration-200"
                            >
                                <div className="text-4xl text-gray-300 mb-4">"</div>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                                    {testimonial.quote}
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl mr-3">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-base md:text-lg">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm md:text-base text-gray-500">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
