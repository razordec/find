import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Check, CreditCard, Lock, Truck, Zap } from 'lucide-react'
import { currentUser } from '@/data/fixtures'
import { useShop } from '@/context/ShopContext'
import { formatPrice, getProduct } from '@/lib/catalog'
import { cdn } from '@/lib/img'
import { createCheckoutSession, getStripeEnabled } from '@/lib/stripe'
import { OrderSummary, SHIPPING_RATES, orderTotals } from '@/components/OrderSummary'
import type { ShippingMethod } from '@/components/OrderSummary'

export const Route = createFileRoute('/checkout/')({
  head: () => ({ meta: [{ title: 'Checkout — CraftedThreads' }] }),
  component: CheckoutPage,
})

const STEPS = ['Shipping', 'Delivery', 'Review & pay'] as const

const field =
  'h-12 w-full rounded-2xl bg-surface-2 px-4 outline-none ring-1 ring-transparent transition focus:bg-surface focus:ring-accent'

function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useShop()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [method, setMethod] = useState<ShippingMethod>('standard')
  const [address, setAddress] = useState({
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    street: '',
    city: '',
    zip: '',
  })
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStripeEnabled().then(setStripeEnabled).catch(() => setStripeEnabled(false))
  }, [])

  if (cart.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Your bag is empty</h1>
        <p className="mt-2 text-muted">Add something you love, then come back to check out.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-ink">Start discovering</Link>
      </div>
    )
  }

  const placeOrder = async () => {
    setPlacing(true)
    setError(null)
    try {
      if (stripeEnabled) {
        const url = await createCheckoutSession({ data: cart })
        if (url) {
          window.location.href = url
          return
        }
      }
      // Without a payment provider configured, confirm the order as a preview.
      const orderId = `KD-${Math.floor(48300 + Math.random() * 600)}`
      const { total } = orderTotals(cartSubtotal, method)
      clearCart()
      navigate({ to: '/checkout/success', search: { order: orderId, total: Math.round(total * 100) / 100 } })
    } catch (e) {
      console.error('Checkout error:', e)
      setError('We couldn’t start checkout. Please try again in a moment.')
      setPlacing(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Checkout</h1>
      <ol className="mt-6 mb-8 flex items-center gap-2 text-sm" aria-label="Checkout progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2" aria-current={i === step ? 'step' : undefined}>
            <span
              className={`grid size-7 place-items-center rounded-full text-xs font-bold transition ${
                i < step ? 'bg-mint text-white' : i === step ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-muted'
              }`}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={i === step ? 'font-semibold' : 'text-muted'}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-line sm:w-12" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="animate-rise rounded-[2rem] bg-surface p-6 ring-1 ring-line/70 sm:p-8" key={step}>
          {step === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setStep(1)
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <h2 className="text-xl font-bold sm:col-span-2">Where should we send it?</h2>
              <Field label="Full name" className="sm:col-span-2">
                <input required autoComplete="name" className={field} value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
              </Field>
              <Field label="Email" className="sm:col-span-2">
                <input required type="email" autoComplete="email" className={field} value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
              </Field>
              <Field label="Street address" className="sm:col-span-2">
                <input required autoComplete="street-address" className={field} value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </Field>
              <Field label="City">
                <input required autoComplete="address-level2" className={field} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </Field>
              <Field label="ZIP code">
                <input required inputMode="numeric" pattern="[0-9]{5}" title="5-digit ZIP code" autoComplete="postal-code" className={field} value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
              </Field>
              <button type="submit" className="mt-2 h-12 rounded-full bg-accent font-semibold text-accent-ink sm:col-span-2">
                Continue to delivery
              </button>
            </form>
          )}

          {step === 1 && (
            <fieldset className="space-y-3">
              <legend className="mb-4 text-xl font-bold">How fast do you need it?</legend>
              {(
                [
                  ['standard', 'Standard', '3–5 business days', Truck],
                  ['express', 'Express', '1–2 business days', Zap],
                ] as const
              ).map(([id, label, eta, Icon]) => {
                const price = orderTotals(cartSubtotal, id).shipping
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl p-4 ring-1 transition ${
                      method === id ? 'bg-accent-soft ring-accent' : 'ring-line hover:bg-surface-2'
                    }`}
                  >
                    <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="accent-[var(--accent)]" />
                    <Icon className="size-5 text-accent" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="block font-semibold">{label}</span>
                      <span className="text-sm text-muted">{eta}</span>
                    </span>
                    <span className="font-semibold">{price === 0 ? 'Free' : formatPrice(price)}</span>
                  </label>
                )
              })}
              <p className="text-xs text-muted">Standard shipping is free on orders over $150. Express is {formatPrice(SHIPPING_RATES.express)}.</p>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setStep(0)} className="h-12 rounded-full px-6 font-semibold ring-1 ring-line">Back</button>
                <button type="button" onClick={() => setStep(2)} className="h-12 flex-1 rounded-full bg-accent font-semibold text-accent-ink">Review order</button>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Review & pay</h2>
              <div className="rounded-2xl bg-surface-2 p-4 text-sm">
                <p className="font-semibold">{address.name}</p>
                <p className="text-muted">{address.street}, {address.city} {address.zip}</p>
                <p className="text-muted">{method === 'express' ? 'Express' : 'Standard'} delivery · {address.email}</p>
                <button type="button" onClick={() => setStep(0)} className="mt-2 text-sm font-semibold text-accent">Edit</button>
              </div>
              <ul className="divide-y divide-line">
                {cart.map((l) => {
                  const p = getProduct(l.productId)!
                  return (
                    <li key={p.id} className="flex items-center gap-3 py-3">
                      <img src={cdn(p.image, 120)} alt="" className="size-14 rounded-xl object-cover" />
                      <span className="flex-1 text-sm">
                        <span className="block font-semibold">{p.name}</span>
                        <span className="text-muted">Qty {l.quantity}</span>
                      </span>
                      <span className="font-semibold">{formatPrice(p.price * l.quantity)}</span>
                    </li>
                  )
                })}
              </ul>
              {error && <p role="alert" className="rounded-2xl bg-coral/10 p-3 text-sm text-coral">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="h-12 rounded-full px-6 font-semibold ring-1 ring-line">Back</button>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placing || stripeEnabled === null}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent font-semibold text-accent-ink shadow-soft disabled:opacity-60"
                >
                  {stripeEnabled ? <CreditCard className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
                  {placing ? 'Placing order…' : `Place order · ${formatPrice(orderTotals(cartSubtotal, method).total)}`}
                </button>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Lock className="size-3.5" aria-hidden="true" />
                {stripeEnabled ? 'You’ll pay securely with Stripe.' : 'Preview checkout — no payment will be taken.'}
              </p>
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary method={method} />
        </aside>
      </div>
    </div>
  )
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
