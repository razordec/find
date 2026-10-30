# CraftedThreads

A Shop-style discovery and shopping platform: featured stores, brand chips, a discovery feed, curated collections, shoppable posts, personalized recommendations, order tracking, saved items, bag and checkout, plus dark mode.

**Stack:** TanStack Start (React 19), Tailwind CSS v4, Context API for cart/user state, Netlify Image CDN, Stripe Checkout (optional), deployed on Netlify.

## Run locally

```bash
pnpm install
netlify dev   # or: pnpm dev
```

Set `STRIPE_SECRET_KEY` to enable real payment; without it checkout runs as a preview. All data currently comes from `src/data/fixtures.ts`.

## Roadmap

See [PLAN.md](PLAN.md): brands/account/collection pages, a Netlify Database backend, Identity accounts, AI recommendations, brand sync, and newsletter forms.
