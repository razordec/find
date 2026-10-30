import { Link } from '@tanstack/react-router'
import { Eye, Heart, Plus, Star } from 'lucide-react'
import type { Badge, Product } from '@/data/fixtures'
import { brandOf, formatPrice } from '@/lib/catalog'
import { cdn, cdnSrcSet } from '@/lib/img'
import { useShop } from '@/context/ShopContext'

const badgeStyles: Record<Badge, string> = {
  Trending: 'bg-accent text-accent-ink',
  'New Arrival': 'bg-mint text-white dark:text-bg',
  'On Sale': 'bg-coral text-white dark:text-bg',
}

export function BadgePill({ badge, className = '' }: { badge: Badge; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase shadow-sm ${badgeStyles[badge]} ${className}`}
    >
      {badge}
    </span>
  )
}

export function SaveButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { isSaved, toggleSaved } = useShop()
  const saved = isSaved(productId)
  return (
    <button
      type="button"
      onClick={() => toggleSaved(productId)}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved items' : 'Save item'}
      className={`grid size-9 place-items-center rounded-full bg-surface/90 text-ink shadow-soft backdrop-blur transition hover:scale-110 active:scale-95 ${className}`}
    >
      <Heart className={`size-4 transition ${saved ? 'fill-coral stroke-coral' : ''}`} />
    </button>
  )
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useShop()
  const brand = brandOf(product)
  const params = { productId: product.id }

  return (
    <article
      className="group animate-rise relative flex w-full flex-col rounded-3xl bg-surface p-2 shadow-soft ring-1 ring-line/70 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-2">
        <Link to="/products/$productId" params={params} tabIndex={-1} aria-hidden="true">
          <img
            src={cdn(product.image, 480)}
            srcSet={cdnSrcSet(product.image, [320, 480, 720])}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            alt=""
            loading="lazy"
            decoding="async"
            width={480}
            height={480}
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        {product.badge && <BadgePill badge={product.badge} className="absolute top-3 left-3" />}
        <SaveButton productId={product.id} className="absolute top-3 right-3" />
        <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100">
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink shadow-lift transition hover:brightness-110 active:scale-[0.98]"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <Plus className="size-4" /> Quick add
          </button>
          <Link
            to="/products/$productId"
            params={params}
            className="grid size-10 place-items-center rounded-full bg-surface/95 text-ink shadow-lift backdrop-blur transition hover:scale-105"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="size-4" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-3 pb-2">
        <Link
          to="/search"
          search={{ brand: brand.id }}
          className="text-xs font-semibold tracking-wide text-muted uppercase hover:text-accent"
        >
          {brand.name}
        </Link>
        <h3 className="mt-1 text-base leading-snug font-semibold">
          <Link to="/products/$productId" params={params} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-muted line-through">
                <span className="sr-only">was </span>
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Star className="size-3.5 fill-amber-400 stroke-amber-400" aria-hidden="true" />
            <span>
              {product.rating}
              <span className="sr-only"> out of 5,</span> ({product.reviews.toLocaleString()})
            </span>
          </span>
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({ products }: { products: Array<Product> }) {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} index={i} />
        </li>
      ))}
    </ul>
  )
}
