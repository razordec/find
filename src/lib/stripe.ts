import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { brandOf, getProduct } from '@/lib/catalog'

export const getStripeEnabled = createServerFn({ method: 'GET' }).handler(
  () => !!process.env.STRIPE_SECRET_KEY
)

const cartSchema = z
  .array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(10),
    }),
  )
  .min(1)
  .max(50)

/** Creates a Stripe Checkout session for the whole bag, priced server-side. */
export const createCheckoutSession = createServerFn({
  method: 'POST',
})
  .validator(cartSchema)
  .handler(async ({ data: lines }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured')
    }
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const origin = process.env.URL ?? process.env.SITE_URL ?? 'http://localhost:3000'

    const line_items = lines.map((line) => {
      const product = getProduct(line.productId)
      if (!product) throw new Error(`Unknown product: ${line.productId}`)
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${brandOf(product).name} — ${product.name}`,
            description: product.shortDescription,
            images: [new URL(product.image, origin).toString()],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: line.quantity,
      }
    })

    const session = await stripe.checkout.sessions.create({
      allowed_payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    return session.url
  })
