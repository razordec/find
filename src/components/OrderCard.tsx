import { Check, Package, Truck } from 'lucide-react'
import { ORDER_STEPS } from '@/data/fixtures'
import type { Order } from '@/data/fixtures'
import { formatPrice, getBrand, getProduct } from '@/lib/catalog'
import { cdn } from '@/lib/img'

export function OrderProgress({ order }: { order: Order }) {
  const step = ORDER_STEPS.indexOf(order.status)
  const pct = (step / (ORDER_STEPS.length - 1)) * 100
  return (
    <div>
      <div
        className="relative h-2 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-label={`Order ${order.id} progress`}
        aria-valuemin={1}
        aria-valuemax={ORDER_STEPS.length}
        aria-valuenow={step + 1}
        aria-valuetext={order.status}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ${
            order.status === 'Delivered' ? 'bg-mint' : 'bg-gradient-to-r from-accent to-coral'
          }`}
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>
      <ol className="mt-2 grid grid-cols-4 text-[11px] text-muted">
        {ORDER_STEPS.map((s, i) => (
          <li
            key={s}
            className={`${i === 0 ? 'text-left' : i === ORDER_STEPS.length - 1 ? 'text-right' : 'text-center'} ${
              i <= step ? 'font-semibold text-ink' : ''
            }`}
          >
            {s}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function OrderCard({ order, detailed = false }: { order: Order; detailed?: boolean }) {
  const brand = getBrand(order.brandId)!
  const items = order.items.map((i) => ({ ...i, product: getProduct(i.productId)! }))
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const delivered = order.status === 'Delivered'
  const live = order.status === 'Out for delivery'

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-line/70">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-11 place-items-center rounded-2xl font-display text-lg font-extrabold"
            style={{ background: brand.tint, color: brand.inkTint }}
            aria-hidden="true"
          >
            {brand.name[0]}
          </span>
          <div>
            <h3 className="font-semibold">{brand.name}</h3>
            <p className="text-xs text-muted">
              #{order.id} · Placed {order.placedOn}
            </p>
          </div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            delivered ? 'bg-mint/15 text-mint' : 'bg-accent-soft text-accent'
          }`}
        >
          {live && (
            <span className="relative flex size-2">
              <span className="animate-ping-soft absolute inset-0 rounded-full bg-accent" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
          )}
          {delivered ? <Check className="size-3.5" /> : !live && <Package className="size-3.5" />}
          {order.status}
        </span>
      </header>

      <div className="flex items-center gap-2">
        {items.map((i) => (
          <div key={i.productId} className="relative">
            <img src={cdn(i.product.image, 128)} alt={i.product.name} loading="lazy" className="size-14 rounded-2xl bg-surface-2 object-cover" />
            {i.quantity > 1 && (
              <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-bg">
                {i.quantity}
              </span>
            )}
          </div>
        ))}
        {detailed && (
          <div className="ml-2 min-w-0 text-sm">
            {items.map((i) => (
              <p key={i.productId} className="truncate">
                {i.product.name}
                {i.quantity > 1 && <span className="text-muted"> × {i.quantity}</span>}
              </p>
            ))}
            <p className="text-muted">{formatPrice(total)} total</p>
          </div>
        )}
      </div>

      <div className="mt-auto space-y-3">
        <p className="text-lg font-bold">{order.eta}</p>
        <OrderProgress order={order} />
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Truck className="size-3.5" aria-hidden="true" />
          {order.carrier} · {order.lastUpdate}
        </p>
      </div>
    </article>
  )
}
