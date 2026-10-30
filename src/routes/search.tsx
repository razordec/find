import { useMemo } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SearchX, Sparkles, X } from 'lucide-react'
import { brands, categories, products } from '@/data/fixtures'
import { getBrand, getCategory } from '@/lib/catalog'
import { search } from '@/lib/search'
import { ProductGrid } from '@/components/ProductCard'

const SORTS = {
  relevance: 'Most relevant',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const

export const Route = createFileRoute('/search')({
  validateSearch: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    sort: z.enum(['relevance', 'price-asc', 'price-desc', 'rating']).optional(),
  }),
  head: () => ({ meta: [{ title: 'Search — CraftedThreads' }] }),
  component: SearchPage,
})

function SearchPage() {
  const { q = '', category, brand, sort = 'relevance' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const result = useMemo(() => search(q), [q])

  const list = useMemo(() => {
    let items = q ? result.products : products
    if (category) items = items.filter((p) => p.category === category)
    if (brand) items = items.filter((p) => p.brandId === brand)
    const sorted = [...items]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [q, result, category, brand, sort])

  const brandObj = brand ? getBrand(brand) : undefined
  const categoryObj = category ? getCategory(category) : undefined
  const heading = q
    ? `Results for “${result.didCorrect ? result.corrected : q}”`
    : brandObj
      ? brandObj.name
      : categoryObj
        ? categoryObj.name
        : 'Browse everything'

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <header className="mb-6">
        {brandObj && !q && <p className="text-sm text-muted">{brandObj.tagline} · synced from {brandObj.storeUrl}</p>}
        <h1 className="text-3xl font-extrabold sm:text-4xl">{heading}</h1>
        {q && result.didCorrect && (
          <p className="mt-2 text-sm text-muted">
            Showing results for <strong className="text-ink">{result.corrected}</strong>. You searched for “{q}”.
          </p>
        )}
        {q && result.intentLabels.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Sparkles className="size-4 text-accent" aria-hidden="true" /> We understood:
            {result.intentLabels.map((l) => (
              <span key={l} className="rounded-full bg-accent-soft px-2.5 py-0.5 font-medium text-accent">{l}</span>
            ))}
          </p>
        )}
      </header>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter by category">
          <FilterChip active={!category} onClick={() => navigate({ search: (s) => ({ ...s, category: undefined }) })}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.id} active={category === c.id} onClick={() => navigate({ search: (s) => ({ ...s, category: c.id }) })}>
              {c.name}
            </FilterChip>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="brand-filter" className="sr-only">Brand</label>
          <select
            id="brand-filter"
            value={brand ?? ''}
            onChange={(e) => navigate({ search: (s) => ({ ...s, brand: e.target.value || undefined }) })}
            className="h-10 rounded-full bg-surface px-4 text-sm font-medium ring-1 ring-line"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <label htmlFor="sort" className="sr-only">Sort</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => navigate({ search: (s) => ({ ...s, sort: e.target.value as keyof typeof SORTS }) })}
            className="h-10 rounded-full bg-surface px-4 text-sm font-medium ring-1 ring-line"
          >
            {Object.entries(SORTS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {(q || brand) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {q && (
            <Link to="/search" search={(s) => ({ ...s, q: undefined })} className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-sm">
              “{q}” <X className="size-3.5" aria-label="Clear search" />
            </Link>
          )}
          {brandObj && (
            <Link to="/search" search={(s) => ({ ...s, brand: undefined })} className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-sm">
              {brandObj.name} <X className="size-3.5" aria-label="Clear brand" />
            </Link>
          )}
        </div>
      )}

      <p className="mb-4 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}</p>

      {list.length > 0 ? (
        <ProductGrid products={list} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface py-16 text-center ring-1 ring-line/70">
          <SearchX className="size-10 text-muted" aria-hidden="true" />
          <h2 className="text-xl font-bold">Nothing matched that search</h2>
          <p className="max-w-sm text-muted">Try fewer words, a brand name, or a phrase like “gifts under $100”.</p>
          <Link to="/search" className="mt-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-ink">Browse everything</Link>
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-ink text-bg' : 'bg-surface text-ink/80 ring-1 ring-line hover:ring-ink/30'
      }`}
    >
      {children}
    </button>
  )
}
