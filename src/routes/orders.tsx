import { createFileRoute } from '@tanstack/react-router'
import { orders } from '@/data/fixtures'
import { OrderCard } from '@/components/OrderCard'

export const Route = createFileRoute('/orders')({
  head: () => ({ meta: [{ title: 'Orders — CraftedThreads' }] }),
  component: OrdersPage,
})

function OrdersPage() {
  const active = orders.filter((o) => o.status !== 'Delivered')
  const past = orders.filter((o) => o.status === 'Delivered')

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 pt-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Your orders</h1>
        <p className="mt-1 text-muted">Every order from every brand, tracked in one place.</p>
      </header>
      <section aria-labelledby="active-title">
        <h2 id="active-title" className="mb-4 text-xl font-bold">On the way</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {active.map((o) => (
            <li key={o.id}><OrderCard order={o} detailed /></li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="past-title">
        <h2 id="past-title" className="mb-4 text-xl font-bold">Delivered</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {past.map((o) => (
            <li key={o.id}><OrderCard order={o} detailed /></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
