import { useEffect, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ChevronRight, RefreshCw, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react'
import { products } from '@/data/fixtures'
import { brandOf, formatPrice, getCategory, getProduct } from '@/lib/catalog'
import { cdn, cdnSrcSet } from '@/lib/img'
import { MAX_QTY, useShop } from '@/context/ShopContext'
import { BadgePill, ProductGrid, SaveButton } from '@/components/ProductCard'
import { Recommendations } from '@/components/home/Recommendations'
import { SectionHeading } from '@/components/SectionHeading'

export const Route = createFileRoute('/products/$productId')({
  component: ProductPage,
  loader: ({ params }) => {
    const product = getProduct(params.productId)
    if (!product) throw notFound()
    return product
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.name} — CraftedThreads` }, { name: 'description', content: loaderData.shortDescription }] : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">We couldn’t find that product</h1>
      <Link to="/" className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-ink">Back to discover</Link>
    </div>
  ),
})

function ProductPage() {
  const product = Route.useLoaderData()
  const brand = brandOf(product)
  const category = getCategory(product.category)!
  const { addToCart, recordView } = useShop()
  const [qty, setQty] = useState(1)
  const moreFromBrand = products.filter((p) => p.brandId === brand.id && p.id !== product.id)

  useEffect(() => {
    recordView(product.id)
    setQty(1)
  }, [product.id, recordView])

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 pt-6 sm:px-6">
      <div>
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 text-sm text-muted">
          <Link to="/" className="hover:text-ink">Discover</Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link to="/search" search={{ category: category.id }} className="hover:text-ink">{category.name}</Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span aria-current="page" className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="animate-rise relative overflow-hidden rounded-[2rem] bg-surface-2 shadow-soft">
            <img
              key={product.id}
              src={cdn(product.image, 1000)}
              srcSet={cdnSrcSet(product.image, [600, 1000, 1400])}
              sizes="(min-width: 1024px) 55vw, 100vw"
              alt={product.name}
              fetchPriority="high"
              width={1000}
              height={1000}
              className="aspect-square size-full object-cover"
            />
            {product.badge && <BadgePill badge={product.badge} className="absolute top-5 left-5" />}
          </div>

          <div className="lg:py-6">
            <Link
              to="/search"
              search={{ brand: brand.id }}
              className="inline-flex items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 text-sm font-semibold ring-1 ring-line hover:ring-accent"
            >
              <span className="grid size-7 place-items-center rounded-full font-display font-extrabold" style={{ background: brand.tint, color: brand.inkTint }} aria-hidden="true">
                {brand.name[0]}
              </span>
              {brand.name}
            </Link>
            <h1 className="mt-4 text-3xl leading-tight font-extrabold sm:text-5xl">{product.name}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
              <Star className="size-4 fill-amber-400 stroke-amber-400" aria-hidden="true" />
              <span className="font-semibold text-ink">{product.rating}</span> · {product.reviews.toLocaleString()} reviews
            </p>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="text-lg text-muted line-through">{formatPrice(product.compareAt)}</span>
                  <span className="rounded-full bg-coral/15 px-2 py-0.5 text-sm font-semibold text-coral">
                    Save {Math.round((1 - product.price / product.compareAt) * 100)}%
                  </span>
                </>
              )}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="qty">Quantity</label>
              <select
                id="qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="h-12 rounded-full bg-surface px-4 font-semibold ring-1 ring-line"
              >
                {Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>Qty {n}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addToCart(product.id, qty)}
                className="h-12 flex-1 rounded-full bg-accent px-8 font-semibold text-accent-ink shadow-soft transition hover:brightness-110 active:scale-[0.98]"
              >
                Add to bag · {formatPrice(product.price * qty)}
              </button>
              <SaveButton productId={product.id} className="size-12 ring-1 ring-line" />
            </div>

            <ul className="mt-8 grid gap-3 rounded-3xl bg-surface p-5 text-sm ring-1 ring-line/70 sm:grid-cols-3">
              <li className="flex items-center gap-2"><Truck className="size-4 text-accent" aria-hidden="true" /> Free shipping over $150</li>
              <li className="flex items-center gap-2"><RotateCcw className="size-4 text-accent" aria-hidden="true" /> 30-day returns</li>
              <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-accent" aria-hidden="true" /> CraftedThreads purchase protection</li>
            </ul>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <RefreshCw className="size-3.5" aria-hidden="true" /> Price and stock synced from {brand.storeUrl} {brand.syncedMinutesAgo} min ago
            </p>
          </div>
        </div>
      </div>

      {moreFromBrand.length > 0 && (
        <section aria-labelledby="more-title">
          <SectionHeading id="more-title" kicker={brand.tagline} title={`More from ${brand.name}`} link={{ label: 'Visit store', to: '/search', search: { brand: brand.id } }} />
          <ProductGrid products={moreFromBrand} />
        </section>
      )}

      <Recommendations exclude={[product.id]} title="You might also like" />
    </div>
  )
}
