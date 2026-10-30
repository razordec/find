import { Link, createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { productsByIds } from '@/lib/catalog'
import { ProductGrid } from '@/components/ProductCard'
import { Recommendations } from '@/components/home/Recommendations'

export const Route = createFileRoute('/saved')({
  head: () => ({ meta: [{ title: 'Saved items — CraftedThreads' }] }),
  component: SavedPage,
})

function SavedPage() {
  const { saved, addToCart } = useShop()
  const items = productsByIds(saved)

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 pt-8 sm:px-6">
      <section>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">Saved items</h1>
            <p className="mt-1 text-muted">{items.length} {items.length === 1 ? 'item' : 'items'} you’re keeping an eye on.</p>
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => items.forEach((p) => addToCart(p.id))}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink shadow-soft"
            >
              Add all to bag
            </button>
          )}
        </header>
        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface py-16 text-center ring-1 ring-line/70">
            <span className="grid size-16 place-items-center rounded-3xl bg-coral/10">
              <Heart className="size-7 text-coral" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold">Nothing saved yet</h2>
            <p className="max-w-sm text-muted">Tap the heart on any product to keep it here for later.</p>
            <Link to="/" className="mt-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-ink">Start discovering</Link>
          </div>
        )}
      </section>
      <Recommendations exclude={saved} />
    </div>
  )
}
