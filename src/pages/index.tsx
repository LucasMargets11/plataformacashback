import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import BrandCarousel from '../components/BrandCarousel'
import FeaturedCauses from '../features/causes/components/FeaturedCauses'
import { HeartHandshake, ShoppingBag, Coins, LineChart } from "lucide-react";


export const steps = [
  {
    title: "Elegí tu causa",
    desc: "Seleccioná la causa que querés apoyar: educación, salud, ambiente u otra.",
    icon: HeartHandshake,
  },
  {
    title: "Comprá donde siempre",
    desc: "Hacé tus compras en tus tiendas de siempre, online o en tienda física.",
    icon: ShoppingBag,
  },
  {
    title: "Cashback para la causa",
    desc: "El cashback de tus compras se acredita a la causa que elegiste, no a tu bolsillo.",
    icon: Coins,
  },
  
];

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
            {/* Hero full-screen with header overlay */}
            <section className="relative -mt-16 min-h-screen flex items-center text-white overflow-hidden">
                {/* Background image (behind the gradient and content) */}
                <div className="absolute inset-0 z-0">
                    <img src="/hero.png" alt="Hero background" className="w-full h-full object-cover opacity-100" />
                </div>
                {/* Dark overlay on top of the image to guarantee text contrast */}
                <div className="absolute inset-0 z-10 bg-black/50" />
                <div className="mx-auto max-w-7xl w-full px-6 pt-24 pb-12 relative z-20">
                    <div className="max-w-5xl text-left">
                        <h1
                            className="
                                text-white font-extrabold tracking-tight leading-[1.05]
                                text-[clamp(24px,5.5vw,56px)]
                            "
                        >
                            <span className="block whitespace-nowrap">Comprás como siempre.</span>
                            <span className="block whitespace-nowrap">Ayudás a la causa que elegís.</span>
                        </h1>
                        <p className="mt-4 text-white/85 max-w-xl">
                            Sumá impacto social con tus compras de todos los días. Elegí tu causa y convertí el cashback en donaciones.
                        </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3 justify-start">
                                <Link to="/signup">
                                    <Button className="inline-flex items-center rounded-lg px-5 py-3">
                                        Crear cuenta
                                    </Button>
                                </Link>
                                <Link to="/causas">
                                    <Button className="inline-flex items-center rounded-lg px-5 py-3">
                                        Ver causas
                                    </Button>
                                </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Logos Section - Auto-scrolling carousel (full-bleed) */}
            <section className="pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-6 lg:pb-6 bg-[color:var(--sky-50)] overflow-x-hidden">
                {/* Eyebrow + Title within container */}
                <div className="max-w-[1280px] mx-auto px-6 md:px-8">
                    <p className="text-center text-[11px] md:text-xs tracking-[0.12em] uppercase text-brand-gray-500 font-semibold mb-2">
                        COMPRA EN TUS MARCAS FAVORITAS
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-brand-navy-900 mb-4 md:mb-5">
                        Ganá cashback con más de 800 marcas
                    </h3>
                </div>
                {/* Full-bleed carousel breaks out of container to touch page edges */}
                    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-x-hidden bg-[color:var(--sky-50)]">
                    <BrandCarousel speedMs={28000} />
                </div>
                {/* CTA back inside container */}
                <div className="max-w-[1280px] mx-auto px-6 md:px-8">
                    <div className="mt-2 text-center">
                        <Link to="/for-consumers" className="inline-flex items-center text-brand-blue-600 hover:text-brand-blue-700 font-medium">
                            Ver todas las marcas →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Causes under the brands carousel */}
            <FeaturedCauses limit={6} title="Causas destacadas" />

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
                                <div className="text-6xl mb-6"><step.icon /></div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 leading-[1.25]">
                                    {step.title}
                                </h3>
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Audience Blocks Section */}
            <section className="py-14 md:py-18 lg:py-24 bg-[color:var(--sky-50)]">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {audienceBlocks.map((block, index) => (
                            <div key={index} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-colors duration-200 group">
                                <h3 className="text-xl md:text-2xl font-semibold text-brand-navy-900 mb-4 leading-[1.25]">{block.title}</h3>
                                <p className="text-base md:text-lg text-brand-gray-500 leading-relaxed mb-6">{block.description}</p>
                                <Link to={block.link} className="inline-flex items-center text-brand-blue-600 hover:text-brand-blue-700 font-medium group-hover:underline transition-colors duration-200">Aprender más<span className="ml-1">→</span></Link>
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
