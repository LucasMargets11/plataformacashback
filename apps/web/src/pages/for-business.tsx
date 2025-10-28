import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function ForMerchantsPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10 text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8">
                        Atrae clientes leales<br />
                        <span className="text-blue-600">con cashback</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                        Aumenta tus ventas y fideliza clientes ofreciendo cashback automático. Conviértete en el lugar preferido de la comunidad y genera impacto social.
                    </p>
                    <Link to="/signup?role=merchant">
                        <Button className="h-12 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-3xl">
                            Unirse como comercio
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Benefits for merchants */}
            <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
                        Beneficios para tu negocio
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="text-6xl mb-6">👥</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Nuevos clientes
                            </h3>
                            <p className="text-gray-600">
                                Atrae compradores comprometidos con causas locales que buscan generar impacto.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="text-6xl mb-6">🔄</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Lealtad aumentada
                            </h3>
                            <p className="text-gray-600">
                                Los clientes regresan porque cada compra apoya sus causas favoritas.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="text-6xl mb-6">🏪</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Impacto comunitario
                            </h3>
                            <p className="text-gray-600">
                                Posiciona tu negocio como un pilar que apoya el deporte y causas locales.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works for merchants */}
            <section className="py-16 md:py-20 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
                        Cómo funciona
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4 flex-shrink-0">
                                    ⚙️
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Configuración simple
                                    </h3>
                                    <p className="text-gray-600">
                                        Integración rápida con tu sistema de pagos existente. Sin cambios complejos.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mr-4 flex-shrink-0">
                                    💳
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Cashback automático
                                    </h3>
                                    <p className="text-gray-600">
                                        Los clientes reciben cashback automáticamente al comprar contigo.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mr-4 flex-shrink-0">
                                    📊
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Analíticas detalladas
                                    </h3>
                                    <p className="text-gray-600">
                                        Observa el impacto en ventas y el crecimiento de tu base de clientes.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-8xl mb-6">🏆</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Comercios exitosos confían en nosotros
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Desde tiendas locales hasta cadenas regionales, todos ven crecimiento con nuestro programa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 lg:py-24 bg-green-600">
                <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Únete a la red de comercios
                    </h2>
                    <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                        Forma parte de la comunidad de negocios que apoyan el deporte y las causas locales.
                    </p>
                    <Link to="/signup?role=merchant">
                        <Button className="h-12 px-8 text-lg font-semibold bg-white hover:bg-gray-100 text-green-600 rounded-3xl">
                            Comenzar ahora
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
