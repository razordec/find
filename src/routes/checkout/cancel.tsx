import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout/cancel')({
  head: () => ({ meta: [{ title: 'Checkout cancelled — CraftedThreads' }] }),
  component: CheckoutCancel,
})

function CheckoutCancel() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-5">
      <div className="max-w-lg rounded-[2rem] bg-surface p-10 text-center shadow-soft ring-1 ring-line/70 sm:p-12">
        <h1 className="text-3xl font-extrabold">Checkout cancelled</h1>
        <p className="mt-3 text-muted">No worries — your bag is saved whenever you’re ready.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/cart" className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink">Back to bag</Link>
          <Link to="/" className="rounded-full px-6 py-3 font-semibold ring-1 ring-line">Keep shopping</Link>
        </div>
      </div>
    </div>
  )
}
