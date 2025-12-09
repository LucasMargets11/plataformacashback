import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import CategoryNotice from './CategoryNotice'

export type Category = {
  id: number
  name: string
  slug: string
  participates_in_cashback: boolean
}

export type StoreItem = {
  id: number
  display_name: string
  address?: string
  description?: string
  logo_url?: string
  website_url?: string
  instagram_url?: string
  categories: Category[]
  has_excluded_categories?: boolean
  excluded_categories?: string[]
}

const StoreCard: React.FC<{ store: StoreItem }> = ({ store }) => {
  return (
    <Card className="flex flex-col p-0 overflow-hidden">
      {/* Cover */}
      <div className="relative h-32 w-full bg-gray-100">
        {store.logo_url ? (
          <img src={store.logo_url} alt={`Logo de ${store.display_name}`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">Sin imagen</div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900">{store.display_name}</h3>
        </div>
        {store.description && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2" style={{display:'-webkit-box', WebkitLineClamp:2 as any, WebkitBoxOrient:'vertical' as any, overflow:'hidden'}}>
            {store.description}
          </p>
        )}
        {/* Categories */}
        <div className="mt-2 text-xs text-gray-700">
          {store.categories.map(c => (
            <span key={c.id} className={`mr-2 mb-1 inline-block rounded-full px-2 py-0.5 border ${c.participates_in_cashback ? 'border-gray-200 text-gray-700' : 'border-amber-300 text-amber-800'}`}>
              {c.name}{!c.participates_in_cashback ? ' • sin cashback' : ''}
            </span>
          ))}
        </div>

        {/* Local notice */}
        {store.has_excluded_categories && store.excluded_categories && store.excluded_categories.length > 0 && (
          <div className="mt-3">
            <CategoryNotice categories={store.excluded_categories} />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {store.website_url && (
            <a href={store.website_url} target="_blank" rel="noopener noreferrer">
              <Button className="h-9 px-3 text-sm">Sitio</Button>
            </a>
          )}
          {store.instagram_url && (
            <a href={store.instagram_url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="h-9 px-3 text-sm">Instagram</Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

export default StoreCard
