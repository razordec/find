import { useState } from 'react'
import { ArrowRight, Check, Mail } from 'lucide-react'

/** Newsletter signup. Captures locally for now — wired to Netlify Forms in PLAN.md. */
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section aria-labelledby="newsletter-title" className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-bg sm:px-12">
      <div aria-hidden="true" className="absolute -top-24 -right-16 size-72 rounded-full bg-accent/60 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-28 left-10 size-64 rounded-full bg-coral/40 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-bg/70 uppercase">
            <Mail className="size-4" aria-hidden="true" /> The CraftedThreads Letter
          </p>
          <h2 id="newsletter-title" className="mt-3 text-3xl font-extrabold sm:text-4xl">
            First dibs on drops, edits and members-only sales.
          </h2>
          <p className="mt-3 max-w-md text-bg/70">One thoughtful email a week. Get 15% off your first order from any brand on CraftedThreads.</p>
        </div>
        {done ? (
          <p role="status" className="flex items-center gap-3 rounded-full bg-bg/10 px-5 py-4 font-semibold">
            <span className="grid size-8 place-items-center rounded-full bg-mint text-white">
              <Check className="size-4" />
            </span>
            You’re in! Check {email} for your welcome code.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
            className="flex flex-col gap-2 rounded-[1.75rem] bg-bg/10 p-2 sm:flex-row sm:rounded-full"
          >
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-full bg-transparent px-5 text-bg outline-none placeholder:text-bg/50"
            />
            <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-full bg-bg px-6 font-semibold text-ink transition hover:gap-3">
              Subscribe <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
