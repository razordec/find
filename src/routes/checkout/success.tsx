import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { formatPrice } from '@/lib/catalog'

export const Route = createFileRoute('/checkout/success')({
  validateSearch: z.object({ order: z.string().optional(), total: z.number().optional() }),
  head: () => ({ meta: [{ title: 'Order confirmed — CraftedThreads' }] }),
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { order, total } = Route.useSearch()
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-5">
      <div className="animate-rise max-w-lg rounded-[2rem] bg-surface p-10 text-center shadow-soft ring-1 ring-line/70 sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint text-white">
          <Check className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold">Thank you for your order!</h1>
        <p className="mt-3 text-muted">
          {order ? (
            <>
              Order <strong className="text-ink">#{order}</strong>
              {total != null && <> for {formatPrice(total)}</>} is confirmed. We’ll let you know as soon as the brand ships it.
            </>
          ) : (
            'Your order is confirmed. We’ll let you know as soon as the brand ships it.'
          )}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink">Track orders</Link>
          <Link to="/" className="rounded-full px-6 py-3 font-semibold ring-1 ring-line">Keep shopping</Link>
        </div>
      </div>
    </div>
  )
}
