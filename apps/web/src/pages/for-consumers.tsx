import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function ForConsumersPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10 text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8">
                        Compra inteligente,<br />
                        <span className="text-blue-600">apoya causas</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                        Obtén reembolsos en efectivo por tus compras diarias mientras apoyas automáticamente las causas que más te importan. Sin cupones, sin códigos, sin complicaciones.
                    </p>
                    <Link to="/signup">
                        <Button className="h-12 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-3xl">
                            Comenzar ahora
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
                        Beneficios para ti
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="text-5xl mb-6">💰</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Cashback real
                            </h3>
                            <p className="text-gray-600">
                                Recibe dinero de vuelta en cada compra, sin trucos ni letra pequeña.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="text-5xl mb-6">❤️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Impacto automático
                            </h3>
                            <p className="text-gray-600">
                                Apoya causas y equipos sin esfuerzo adicional, solo comprando normalmente.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="text-5xl mb-6">🛡️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Compras seguras
                            </h3>
                            <p className="text-gray-600">
                                Protección total en todas tus transacciones con tecnología bancaria.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Únete a miles de compradores que ya están generando impacto con sus compras diarias.
                    </p>
                    <Link to="/signup">
                        <Button className="h-12 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-3xl">
                            Crear cuenta gratis
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}