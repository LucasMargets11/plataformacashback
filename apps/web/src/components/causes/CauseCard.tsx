import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import type { ApiCause } from '../../lib/api'

type Props = { cause: ApiCause }

const CauseCard: React.FC<Props> = ({ cause }) => {
  const navigate = useNavigate()
  const goDetail = () => navigate(`/app/causes/${cause.slug}`)
  const goStores = () => navigate(`/app/stores`)

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        {cause.image_url ? (
          <img
            src={cause.image_url}
            alt={`Imagen de la causa ${cause.title}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">Sin imagen</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900">{cause.title}</h3>
        {cause.summary && (
          <p className="mt-1 text-sm text-gray-700 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
            {cause.summary}
          </p>
        )}
        <div className="mt-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto">
          <Button className="h-9 px-3 text-sm" onClick={goDetail} aria-label={`Ver causa ${cause.title}`}>Ver causa</Button>
          <Button className="h-9 px-3 text-sm" variant="secondary" onClick={goStores} aria-label={`Ver tiendas participantes`}>Ver tiendas</Button>
        </div>
      </div>
    </div>
  )
}

export default CauseCard
