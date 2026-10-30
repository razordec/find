import { Link, createFileRoute } from '@tanstack/react-router'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { brandOf, formatPrice, getProduct } from '@/lib/catalog'
import { cdn } from '@/lib/img'
import { QuantityStepper, ShippingProgress } from '@/components/CartDrawer'
import { OrderSummary } from '@/components/OrderSummary'
import { SaveButton } from '@/components/ProductCard'
import { Recommendations } from '@/components/home/Recommendations'

export const Route = createFileRoute('/cart')({
  head: () => ({ meta: [{ title: 'Your bag — CraftedThreads' }] }),
  component: CartPage,
})

function CartPage() {
  const { cart, cartSubtotal, removeFromCart } = useShop()

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 pt-8 sm:px-6">
      <div>
        <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl">Your bag</h1>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface py-16 text-center ring-1 ring-line/70">
            <ShoppingBag className="size-10 text-muted" aria-hidden="true" />
            <h2 className="text-xl font-bold">Your bag is empty</h2>
            <Link to="/" className="mt-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-ink">Start discovering</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
            <div className="space-y-4">
              <ShippingProgress subtotal={cartSubtotal} />
              <ul className="divide-y divide-line rounded-[2rem] bg-surface px-5 ring-1 ring-line/70">
                {cart.map((line) => {
                  const p = getProduct(line.productId)!
                  return (
                    <li key={p.id} className="flex gap-4 py-5">
                      <img src={cdn(p.image, 240)} alt="" className="size-24 rounded-2xl bg-surface-2 object-cover sm:size-28" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-xs font-semibold text-muted uppercase">{brandOf(p).name}</p>
                        <Link to="/products/$productId" params={{ productId: p.id }} className="font-semibold hover:text-accent">{p.name}</Link>
                        <p className="text-sm text-muted">{formatPrice(p.price)} each</p>
                        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                          <QuantityStepper productId={p.id} quantity={line.quantity} />
                          <SaveButton productId={p.id} className="size-8 shadow-none ring-1 ring-line" />
                          <button type="button" onClick={() => removeFromCart(p.id)} className="flex items-center gap-1 text-sm text-muted hover:text-coral">
                            <Trash2 className="size-4" aria-hidden="true" /> Remove
                          </button>
                        </div>
                      </div>
                      <p className="font-bold">{formatPrice(p.price * line.quantity)}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <OrderSummary />
              <Link to="/checkout" className="block rounded-full bg-accent py-4 text-center font-semibold text-accent-ink shadow-soft transition hover:brightness-110">
                Continue to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
      <Recommendations exclude={cart.map((l) => l.productId)} title="Complete your bag" />
    </div>
  )
}
