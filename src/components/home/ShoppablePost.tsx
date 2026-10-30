import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Plus, X } from 'lucide-react'
import type { ShoppablePost as Post } from '@/data/fixtures'
import { brandOf, formatPrice, getProduct } from '@/lib/catalog'
import { cdn, cdnSrcSet } from '@/lib/img'
import { useShop } from '@/context/ShopContext'

export function ShoppablePost({ post }: { post: Post }) {
  const [active, setActive] = useState<string | null>(null)
  const { addToCart } = useShop()
  const activeSpot = post.hotspots.find((h) => h.productId === active)
  const activeProduct = active ? getProduct(active) : undefined

  return (
    <article className="overflow-hidden rounded-[2rem] bg-surface shadow-soft ring-1 ring-line/70">
      <header className="flex items-center gap-3 p-4">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-accent to-coral font-bold text-white" aria-hidden="true">
          {post.author[0]}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{post.author}</h3>
          <p className="text-xs text-muted">{post.handle}</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted">
          <Heart className="size-3.5" aria-hidden="true" /> {post.likes.toLocaleString()}
        </span>
      </header>

      <div className="relative aspect-[4/5] bg-surface-2">
        <img
          src={cdn(post.image, 800)}
          srcSet={cdnSrcSet(post.image, [480, 800, 1100])}
          sizes="(min-width: 1024px) 40vw, 100vw"
          alt={post.caption}
          loading="lazy"
          className="size-full object-cover"
        />
        {post.hotspots.map((h, i) => {
          const p = getProduct(h.productId)!
          const isActive = active === h.productId
          return (
            <button
              key={h.productId}
              type="button"
              onClick={() => setActive(isActive ? null : h.productId)}
              aria-expanded={isActive}
              aria-label={`${isActive ? 'Hide' : 'Show'} ${p.name}, ${formatPrice(p.price)}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className="relative grid size-8 place-items-center">
                {!isActive && <span className="animate-ping-soft absolute inset-1 rounded-full bg-white" style={{ animationDelay: `${i * 300}ms` }} />}
                <span
                  className={`relative grid size-7 place-items-center rounded-full shadow-lift ring-2 ring-white/70 transition ${
                    isActive ? 'rotate-45 bg-accent text-white' : 'bg-white text-[#17140f]'
                  }`}
                >
                  <Plus className="size-4" />
                </span>
              </span>
            </button>
          )
        })}

        {activeProduct && activeSpot && (
          <div
            className="animate-fade absolute inset-x-3 z-10 flex items-center gap-3 rounded-2xl bg-surface/95 p-2 shadow-lift backdrop-blur"
            style={activeSpot.y > 55 ? { top: '0.75rem' } : { bottom: '0.75rem' }}
          >
            <img src={cdn(activeProduct.image, 120)} alt="" className="size-14 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">{brandOf(activeProduct).name}</p>
              <Link to="/products/$productId" params={{ productId: activeProduct.id }} className="block truncate text-sm font-semibold hover:text-accent">
                {activeProduct.name}
              </Link>
              <p className="text-sm font-bold">{formatPrice(activeProduct.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => addToCart(activeProduct.id)}
              className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-ink"
            >
              Add
            </button>
            <button type="button" onClick={() => setActive(null)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Close product preview">
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      <p className="p-4 text-sm">
        <span className="font-semibold">{post.handle}</span> {post.caption}
      </p>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4" aria-label="Products in this post">
        {post.hotspots.map((h) => {
          const p = getProduct(h.productId)!
          return (
            <li key={h.productId}>
              <button
                type="button"
                onClick={() => setActive(h.productId)}
                className={`flex shrink-0 items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs whitespace-nowrap ring-1 transition ${
                  active === h.productId ? 'bg-accent-soft ring-accent' : 'bg-surface-2 ring-transparent hover:ring-line'
                }`}
              >
                <img src={cdn(p.image, 64)} alt="" className="size-6 rounded-full object-cover" />
                {p.name} · <strong>{formatPrice(p.price)}</strong>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
