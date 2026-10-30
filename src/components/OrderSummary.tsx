import { useShop } from '@/context/ShopContext'
import { formatPrice } from '@/lib/catalog'
import { FREE_SHIPPING_AT } from './CartDrawer'

export const SHIPPING_RATES = { standard: 8, express: 18 } as const
export type ShippingMethod = keyof typeof SHIPPING_RATES
const TAX_RATE = 0.0825

export function orderTotals(subtotal: number, method: ShippingMethod = 'standard') {
  const shipping = method === 'standard' && subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_RATES[method]
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}

export function OrderSummary({ method = 'standard' }: { method?: ShippingMethod }) {
  const { cartSubtotal, cartCount } = useShop()
  const t = orderTotals(cartSubtotal, method)
  return (
    <div className="rounded-[2rem] bg-surface p-6 ring-1 ring-line/70">
      <h2 className="text-lg font-bold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label={`Subtotal (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`} value={formatPrice(t.subtotal)} />
        <Row label="Shipping" value={t.shipping === 0 ? 'Free' : formatPrice(t.shipping)} />
        <Row label="Estimated tax" value={formatPrice(t.tax)} />
        <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatPrice(t.total)}</dd>
        </div>
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
