import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Flame, Percent, Sparkles } from 'lucide-react'
import { collections, currentUser, orders, products, shoppablePosts } from '@/data/fixtures'
import type { Badge } from '@/data/fixtures'
import { FeatureBanner } from '@/components/home/FeatureBanner'
import { BrandChips } from '@/components/home/BrandChips'
import { CollectionCard } from '@/components/home/Collections'
import { ShoppablePost } from '@/components/home/ShoppablePost'
import { Recommendations } from '@/components/home/Recommendations'
import { OrderCard } from '@/components/OrderCard'
import { ProductGrid } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import { Newsletter } from '@/components/Newsletter'

export const Route = createFileRoute('/')({
  component: Home,
})

const FEED_TABS: Array<{ id: 'all' | Badge; label: string; icon?: typeof Flame }> = [
  { id: 'all', label: 'For you' },
  { id: 'Trending', label: 'Trending', icon: Flame },
  { id: 'New Arrival', label: 'New arrivals', icon: Sparkles },
  { id: 'On Sale', label: 'On sale', icon: Percent },
]

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function Home() {
  const [tab, setTab] = useState<(typeof FEED_TABS)[number]['id']>('all')
  const feed = tab === 'all' ? products : products.filter((p) => p.badge === tab)
  const activeOrders = orders.filter((o) => o.status !== 'Delivered')

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="space-y-5">
        <p className="text-sm text-muted" suppressHydrationWarning>
          {greeting()}, <span className="font-semibold text-ink">{currentUser.firstName}</span> — here’s what’s new from your brands.
        </p>
        <FeatureBanner />
        <BrandChips />
      </div>

      <section aria-labelledby="orders-title">
        <SectionHeading
          id="orders-title"
          kicker="Order tracking"
          title={`${activeOrders.length} orders on the way`}
          link={{ label: 'All orders', to: '/orders' }}
        />
        <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
          {activeOrders.map((o) => (
            <li key={o.id} className="w-[85%] shrink-0 snap-start sm:w-[22rem] lg:w-auto">
              <OrderCard order={o} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="feed-title">
        <SectionHeading
          id="feed-title"
          kicker="Discover"
          title="Fresh finds from independent brands"
          link={{ label: 'Browse everything', to: '/search' }}
        />
        <div role="tablist" aria-label="Filter discovery feed" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
          {FEED_TABS.map((t) => {
            const Icon = t.icon
            const selected = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="feed-panel"
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selected ? 'bg-ink text-bg shadow-soft' : 'bg-surface text-ink/80 ring-1 ring-line hover:ring-ink/30'
                }`}
              >
                {Icon && <Icon className="size-4" aria-hidden="true" />}
                {t.label}
              </button>
            )
          })}
        </div>
        <div id="feed-panel" role="tabpanel" key={tab}>
          <ProductGrid products={feed} />
        </div>
      </section>

      <section id="collections" aria-labelledby="collections-title" className="scroll-mt-32">
        <SectionHeading
          id="collections-title"
          kicker="Curated collections"
          title="Edits we can’t stop thinking about"
          description="Hand-picked by our editors across every brand on CraftedThreads."
        />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-2">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} large={i === 0} />
          ))}
        </div>
      </section>

      <section id="posts" aria-labelledby="posts-title" className="scroll-mt-32">
        <SectionHeading
          id="posts-title"
          kicker="Shoppable posts"
          title="Shop the look"
          description="Tap the dots to shop what you see in posts from the community."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {shoppablePosts.map((p) => (
            <ShoppablePost key={p.id} post={p} />
          ))}
        </div>
      </section>

      <Recommendations />

      <section aria-label="Promotion" className="grid gap-4 md:grid-cols-2">
        <Link
          to="/search"
          search={{ q: 'on sale' }}
          className="group flex items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-br from-coral to-[#ff9a5a] p-8 text-white shadow-soft transition hover:shadow-lift"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase opacity-90">This week only</p>
            <p className="mt-1 font-display text-3xl font-extrabold">Up to 25% off</p>
            <p className="mt-1 opacity-90">Cast iron, knitwear and lighting.</p>
          </div>
          <ArrowRight className="size-7 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <Link
          to="/search"
          search={{ q: 'gifts under $100' }}
          className="group flex items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-br from-accent to-[#9b6bff] p-8 text-white shadow-soft transition hover:shadow-lift"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase opacity-90">Gift guide</p>
            <p className="mt-1 font-display text-3xl font-extrabold">Gifts under $100</p>
            <p className="mt-1 opacity-90">Thoughtful picks they’ll actually use.</p>
          </div>
          <ArrowRight className="size-7 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </section>

      <Newsletter />
    </div>
  )
}
