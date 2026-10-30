import { Sparkles } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { recommendFor } from '@/lib/catalog'
import { ProductGrid } from '@/components/ProductCard'

export function Recommendations({ exclude = [] as Array<string>, title = 'Picked for you' }) {
  const { viewed } = useShop()
  const { reason, items } = recommendFor([...exclude, ...viewed.filter((id) => !exclude.includes(id))], 4)

  return (
    <section aria-labelledby="recs-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" /> Personalized
          </p>
          <h2 id="recs-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h2>
          <p className="mt-1 text-muted">
            {reason ? (
              <>
                Because you viewed <span className="font-semibold text-ink">{reason.name}</span>
              </>
            ) : (
              'Popular with shoppers like you — browse a few items and this feed learns your taste.'
            )}
          </p>
        </div>
      </div>
      <ProductGrid products={items} />
    </section>
  )
}
