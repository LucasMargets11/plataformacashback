import React from 'react'
import { useParams } from 'react-router-dom'

export default function CauseDetailPage() {
  const { slug } = useParams()
  return (
    <div className="min-h-screen bg-white pt-6 pb-12">
      <div className="mx-auto max-w-screen-xl px-6 md:px-8 lg:px-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Causa</h1>
        <p className="text-gray-600 mt-2">Detalle de la causa "{slug}". (Próximamente)</p>
      </div>
    </div>
  )
}
