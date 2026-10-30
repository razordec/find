import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { MAX_QTY, useShop } from '@/context/ShopContext'
import { brandOf, formatPrice, getProduct } from '@/lib/catalog'
import { cdn } from '@/lib/img'

export const FREE_SHIPPING_AT = 150

export function QuantityStepper({ productId, quantity }: { productId: string; quantity: number }) {
  const { setQuantity } = useShop()
  const name = getProduct(productId)?.name ?? 'item'
  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-line" role="group" aria-label={`Quantity for ${name}`}>
      <button
        type="button"
        onClick={() => setQuantity(productId, quantity - 1)}
        className="grid size-8 place-items-center rounded-full hover:bg-surface-2"
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => setQuantity(productId, quantity + 1)}
        disabled={quantity >= MAX_QTY}
        className="grid size-8 place-items-center rounded-full hover:bg-surface-2 disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <p className="flex items-center gap-2 text-sm">
        <Truck className="size-4 text-accent" aria-hidden="true" />
        {remaining > 0 ? (
          <span>
            You’re <strong>{formatPrice(remaining)}</strong> away from free shipping
          </span>
        ) : (
          <span className="font-semibold">You’ve unlocked free shipping</span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-coral transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartSubtotal, removeFromCart } = useShop()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cartOpen) return
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} aria-hidden="true" />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-lift outline-none"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="text-xl font-bold">Your bag</h2>
          <button type="button" onClick={() => setCartOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-surface-2" aria-label="Close bag">
            <X className="size-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-surface-2">
              <ShoppingBag className="size-7 text-muted" />
            </span>
            <p className="text-lg font-semibold">Your bag is empty</p>
            <p className="text-sm text-muted">Discover something from the brands you love.</p>
            <button type="button" onClick={() => setCartOpen(false)} className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink">
              Keep exploring
            </button>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <ShippingProgress subtotal={cartSubtotal} />
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.map((line) => {
                const p = getProduct(line.productId)!
                return (
                  <li key={line.productId} className="flex gap-4 py-4">
                    <img src={cdn(p.image, 160)} alt="" className="size-20 rounded-2xl bg-surface-2 object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-xs font-semibold text-muted uppercase">{brandOf(p).name}</p>
                      <Link to="/products/$productId" params={{ productId: p.id }} onClick={() => setCartOpen(false)} className="truncate font-semibold hover:text-accent">
                        {p.name}
                      </Link>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QuantityStepper productId={p.id} quantity={line.quantity} />
                        <span className="font-semibold">{formatPrice(p.price * line.quantity)}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFromCart(p.id)} className="self-start text-muted hover:text-coral" aria-label={`Remove ${p.name}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="space-y-3 border-t border-line p-5">
              <div className="flex justify-between text-base">
                <span className="text-muted">Subtotal</span>
                <span className="font-bold">{formatPrice(cartSubtotal)}</span>
              </div>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="block rounded-full bg-accent py-3.5 text-center font-semibold text-accent-ink shadow-soft transition hover:brightness-110">
                Checkout
              </Link>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="block rounded-full py-2 text-center text-sm font-semibold ring-1 ring-line hover:bg-surface-2">
                View full bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
