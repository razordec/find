/**
 * Stubbed catalog, brand, editorial and order data.
 *
 * Every screen reads from this module (directly or via `src/lib/catalog.ts`),
 * so a later milestone can swap it for Netlify Database queries without
 * touching components. See PLAN.md.
 */

export type Badge = 'Trending' | 'New Arrival' | 'On Sale'

export type CategoryId =
  | 'kitchen'
  | 'home'
  | 'fashion'
  | 'beauty'
  | 'tech'
  | 'outdoors'
  | 'pantry'

export interface Category {
  id: CategoryId
  name: string
  blurb: string
}

export interface Brand {
  id: string
  name: string
  tagline: string
  /** Storefront the merchandising is synced from (brand sync stub). */
  storeUrl: string
  syncedMinutesAgo: number
  /** Monogram tile colours for the brand chip. */
  tint: string
  inkTint: string
}

export interface Product {
  id: string
  name: string
  brandId: string
  category: CategoryId
  price: number
  compareAt?: number
  image: string
  shortDescription: string
  description: string
  badge?: Badge
  rating: number
  reviews: number
  tags: Array<string>
}

export interface Collection {
  id: string
  title: string
  kicker: string
  description: string
  image: string
  productIds: Array<string>
}

export interface Hotspot {
  productId: string
  /** Position as a percentage of the image box. */
  x: number
  y: number
}

export interface ShoppablePost {
  id: string
  author: string
  handle: string
  caption: string
  image: string
  likes: number
  hotspots: Array<Hotspot>
}

export type OrderStatus = 'Ordered' | 'Shipped' | 'Out for delivery' | 'Delivered'

export interface Order {
  id: string
  brandId: string
  placedOn: string
  status: OrderStatus
  /** Human-readable delivery estimate or confirmation. */
  eta: string
  carrier: string
  items: Array<{ productId: string; quantity: number }>
  lastUpdate: string
}

export const ORDER_STEPS: Array<OrderStatus> = [
  'Ordered',
  'Shipped',
  'Out for delivery',
  'Delivered',
]

export const categories: Array<Category> = [
  { id: 'kitchen', name: 'Kitchen', blurb: 'Cookware & tableware' },
  { id: 'home', name: 'Home', blurb: 'Lighting, linens & decor' },
  { id: 'fashion', name: 'Fashion', blurb: 'Knitwear, shoes & jewelry' },
  { id: 'beauty', name: 'Beauty', blurb: 'Skincare rituals' },
  { id: 'tech', name: 'Tech', blurb: 'Audio & everyday gadgets' },
  { id: 'outdoors', name: 'Outdoors', blurb: 'Packs & trail gear' },
  { id: 'pantry', name: 'Pantry', blurb: 'Tea, coffee & treats' },
]

export const brands: Array<Brand> = [
  { id: 'maison-cocotte', name: 'Maison Cocotte', tagline: 'Enameled cast iron, made to be handed down', storeUrl: 'maisoncocotte.com', syncedMinutesAgo: 12, tint: '#cfe0d2', inkTint: '#2f4a37' },
  { id: 'fern-field', name: 'Fern & Field', tagline: 'Natural fibers, slow made', storeUrl: 'fernandfield.co', syncedMinutesAgo: 34, tint: '#ead9c2', inkTint: '#6b4a24' },
  { id: 'arlo-audio', name: 'Arlo Audio', tagline: 'Warm sound, quiet design', storeUrl: 'arloaudio.com', syncedMinutesAgo: 8, tint: '#e9e4da', inkTint: '#3b362d' },
  { id: 'solstice-skin', name: 'Solstice Skin', tagline: 'Clinical results, gentle formulas', storeUrl: 'solsticeskin.com', syncedMinutesAgo: 51, tint: '#ffd9b8', inkTint: '#8a3b06' },
  { id: 'northbound', name: 'Northbound', tagline: 'Built for the long weekend', storeUrl: 'northbound.supply', syncedMinutesAgo: 22, tint: '#d4dbc0', inkTint: '#3e4a1f' },
  { id: 'lumiere-home', name: 'Lumière Home', tagline: 'Light, softened', storeUrl: 'lumierehome.com', syncedMinutesAgo: 67, tint: '#f3cdb8', inkTint: '#7c3416' },
  { id: 'pace-athletics', name: 'Pace Athletics', tagline: 'Everyday miles, lighter', storeUrl: 'paceathletics.com', syncedMinutesAgo: 5, tint: '#dfe3ea', inkTint: '#2c3446' },
  { id: 'ondine', name: 'Ondine', tagline: 'Recycled gold, modern heirlooms', storeUrl: 'ondinejewelry.com', syncedMinutesAgo: 41, tint: '#f3e4b5', inkTint: '#6e5408' },
  { id: 'bramble-tea', name: 'Bramble Tea Co.', tagline: 'Small-batch leaves, direct from growers', storeUrl: 'brambletea.co', syncedMinutesAgo: 18, tint: '#e2d6f2', inkTint: '#4a2f78' },
]

export const products: Array<Product> = [
  {
    id: 'cocotte-dutch-oven',
    name: 'Signature Dutch Oven 5.5 qt',
    brandId: 'maison-cocotte',
    category: 'kitchen',
    price: 189,
    compareAt: 245,
    image: '/img/p-dutch-oven.png',
    shortDescription: 'Sage enameled cast iron with a solid brass knob.',
    description:
      'Our best-selling round dutch oven, sand-cast and finished with three coats of chip-resistant sage enamel. Even heat for braises, bread and slow Sunday stews — oven safe to 500°F and built to last a lifetime.',
    badge: 'On Sale',
    rating: 4.9,
    reviews: 2381,
    tags: ['cast iron', 'cookware', 'pot', 'gift', 'green', 'baking', 'bread'],
  },
  {
    id: 'cocotte-bake-set',
    name: 'Speckled Stoneware Bake Set',
    brandId: 'maison-cocotte',
    category: 'kitchen',
    price: 68,
    image: '/img/p-bake-set.png',
    shortDescription: 'Three nesting dishes, oven to table.',
    description:
      'A trio of nesting stoneware bakers in a soft cream speckle glaze. Roast vegetables, bake gratins or serve straight from the oven — dishwasher and microwave safe.',
    badge: 'New Arrival',
    rating: 4.7,
    reviews: 412,
    tags: ['stoneware', 'bakeware', 'dishes', 'ceramic', 'gift', 'baking'],
  },
  {
    id: 'fern-linen-throw',
    name: 'Washed Linen Throw',
    brandId: 'fern-field',
    category: 'home',
    price: 124,
    image: '/img/p-linen-throw.png',
    shortDescription: 'Stonewashed European flax with hand-knotted fringe.',
    description:
      'Woven from European flax and stonewashed for a lived-in softness from day one. Breathable in summer, layered in winter, and only gets better with every wash.',
    badge: 'Trending',
    rating: 4.8,
    reviews: 968,
    tags: ['linen', 'blanket', 'throw', 'bedding', 'cozy', 'gift', 'neutral'],
  },
  {
    id: 'arlo-headphones',
    name: 'Studio One Wireless Headphones',
    brandId: 'arlo-audio',
    category: 'tech',
    price: 249,
    image: '/img/p-headphones.png',
    shortDescription: 'Adaptive noise cancelling, 40-hour battery.',
    description:
      'Studio-tuned 40mm drivers, adaptive noise cancelling and a 40-hour battery wrapped in cream aluminum and vegan leather. Folds flat into a felt travel case.',
    badge: 'Trending',
    rating: 4.6,
    reviews: 1520,
    tags: ['headphones', 'audio', 'wireless', 'music', 'noise cancelling', 'gift', 'bluetooth'],
  },
  {
    id: 'solstice-vitamin-c',
    name: 'Daybreak Vitamin C Serum',
    brandId: 'solstice-skin',
    category: 'beauty',
    price: 42,
    image: '/img/p-serum.png',
    shortDescription: '15% vitamin C with ferulic acid for glow.',
    description:
      'A stable 15% L-ascorbic acid serum with ferulic acid and vitamin E to brighten, even tone and defend against daily stressors. Fragrance free, suitable for sensitive skin.',
    badge: 'New Arrival',
    rating: 4.5,
    reviews: 733,
    tags: ['serum', 'skincare', 'vitamin c', 'glow', 'face', 'gift'],
  },
  {
    id: 'northbound-backpack',
    name: 'Ridgeline Waxed Canvas Pack',
    brandId: 'northbound',
    category: 'outdoors',
    price: 158,
    image: '/img/p-backpack.png',
    shortDescription: 'Roll-top, 24L, full-grain leather straps.',
    description:
      'A weatherproof waxed canvas roll-top with a padded laptop sleeve, quick-access side pockets and full-grain leather straps that patina beautifully over the years.',
    rating: 4.8,
    reviews: 604,
    tags: ['backpack', 'bag', 'travel', 'hiking', 'canvas', 'green', 'laptop'],
  },
  {
    id: 'lumiere-lamp',
    name: 'Terra Pleated Table Lamp',
    brandId: 'lumiere-home',
    category: 'home',
    price: 96,
    compareAt: 128,
    image: '/img/p-lamp.png',
    shortDescription: 'Hand-thrown terracotta base, pleated linen shade.',
    description:
      'Each base is hand-thrown in small batches, so no two lamps are quite the same. Topped with a pleated linen shade that casts a warm, diffused glow.',
    badge: 'On Sale',
    rating: 4.7,
    reviews: 287,
    tags: ['lamp', 'lighting', 'ceramic', 'decor', 'terracotta', 'living room'],
  },
  {
    id: 'pace-knit-runner',
    name: 'Cloudknit Everyday Runner',
    brandId: 'pace-athletics',
    category: 'fashion',
    price: 132,
    image: '/img/p-sneakers.png',
    shortDescription: 'Featherlight knit upper with recycled foam sole.',
    description:
      'A breathable recycled knit upper on a springy, plant-based foam midsole. Designed for daily miles, errands and everything between.',
    badge: 'Trending',
    rating: 4.6,
    reviews: 1893,
    tags: ['sneakers', 'shoes', 'running', 'trainers', 'grey', 'athletic'],
  },
  {
    id: 'ondine-hoops',
    name: 'Bold Gold Hoops',
    brandId: 'ondine',
    category: 'fashion',
    price: 58,
    image: '/img/p-earrings.png',
    shortDescription: 'Recycled 14k gold vermeil, featherlight.',
    description:
      'Chunky everyday hoops in thick 14k gold vermeil over recycled sterling silver. Hollow-core for all-day comfort, hypoallergenic posts.',
    badge: 'New Arrival',
    rating: 4.9,
    reviews: 1104,
    tags: ['earrings', 'jewelry', 'gold', 'hoops', 'gift', 'accessories'],
  },
  {
    id: 'bramble-sampler',
    name: 'Loose Leaf Discovery Sampler',
    brandId: 'bramble-tea',
    category: 'pantry',
    price: 34,
    image: '/img/p-tea.png',
    shortDescription: 'Four seasonal teas plus a glass teapot.',
    description:
      'A curated set of four seasonal single-origin teas — from a bright first-flush green to a malty hojicha — with a heat-safe glass teapot and infuser.',
    rating: 4.8,
    reviews: 529,
    tags: ['tea', 'teapot', 'drinks', 'gift', 'sampler', 'morning'],
  },
  {
    id: 'fern-merino-crew',
    name: 'Merino Crewneck Sweater',
    brandId: 'fern-field',
    category: 'fashion',
    price: 118,
    compareAt: 148,
    image: '/img/p-sweater.png',
    shortDescription: 'Extra-fine merino in burnt rust.',
    description:
      'Knit from traceable extra-fine merino for a soft, itch-free hand. A relaxed crew silhouette with ribbed trims that keeps its shape season after season.',
    badge: 'On Sale',
    rating: 4.7,
    reviews: 842,
    tags: ['sweater', 'knitwear', 'wool', 'merino', 'jumper', 'orange', 'cozy'],
  },
  {
    id: 'arlo-speaker',
    name: 'Roam Portable Speaker',
    brandId: 'arlo-audio',
    category: 'tech',
    price: 89,
    image: '/img/p-speaker.png',
    shortDescription: '360° sound, splashproof, 18-hour play.',
    description:
      'Room-filling 360° sound in a splashproof fabric shell with a leather carry strap. Pair two for stereo and take the party from kitchen to campsite.',
    rating: 4.5,
    reviews: 690,
    tags: ['speaker', 'audio', 'bluetooth', 'music', 'portable', 'wireless'],
  },
]

export const featuredBrand = {
  brandId: 'maison-cocotte',
  kicker: 'Featured store',
  title: 'The Cocotte Kitchen Edit',
  description:
    'Enameled cast iron and speckled stoneware for slow suppers and crusty loaves — up to 25% off the signature line this week.',
  image: '/img/hero-cocotte.png',
  productIds: ['cocotte-dutch-oven', 'cocotte-bake-set'],
}

export const collections: Array<Collection> = [
  {
    id: 'slow-morning',
    title: 'The Slow Morning',
    kicker: 'Editor’s edit',
    description: 'Linen, loose leaf and a little quiet before the day begins.',
    image: '/img/col-slow-morning.png',
    productIds: ['bramble-sampler', 'fern-linen-throw', 'cocotte-bake-set', 'lumiere-lamp'],
  },
  {
    id: 'weekend-outdoors',
    title: 'Weekend, Outdoors',
    kicker: 'Get out there',
    description: 'Packable, weatherproof and ready for the trailhead.',
    image: '/img/col-outdoors.png',
    productIds: ['northbound-backpack', 'pace-knit-runner', 'arlo-speaker', 'fern-merino-crew'],
  },
  {
    id: 'glow-ritual',
    title: 'The Glow Ritual',
    kicker: 'Self-care',
    description: 'Brightening serums and a touch of gold for every day.',
    image: '/img/col-glow.png',
    productIds: ['solstice-vitamin-c', 'ondine-hoops', 'fern-linen-throw'],
  },
]

export const shoppablePosts: Array<ShoppablePost> = [
  {
    id: 'post-living',
    author: 'Mara Lindqvist',
    handle: '@mara.at.home',
    caption: 'Sunday reset: terracotta glow, linen everything and a little music in the background.',
    image: '/img/post-living.png',
    likes: 4812,
    hotspots: [
      { productId: 'lumiere-lamp', x: 19, y: 54 },
      { productId: 'fern-linen-throw', x: 47, y: 66 },
      { productId: 'arlo-speaker', x: 80, y: 68 },
    ],
  },
  {
    id: 'post-weekend',
    author: 'Theo Park',
    handle: '@theo.packs.light',
    caption: 'Everything I’m bringing up north this weekend. Fits in one bag — promise.',
    image: '/img/post-weekend.png',
    likes: 3290,
    hotspots: [
      { productId: 'northbound-backpack', x: 30, y: 36 },
      { productId: 'fern-merino-crew', x: 74, y: 38 },
      { productId: 'pace-knit-runner', x: 52, y: 80 },
      { productId: 'ondine-hoops', x: 25, y: 76 },
    ],
  },
]

export const orders: Array<Order> = [
  {
    id: 'KD-48213',
    brandId: 'arlo-audio',
    placedOn: 'Oct 26',
    status: 'Out for delivery',
    eta: 'Arriving today by 8pm',
    carrier: 'DHL',
    items: [{ productId: 'arlo-headphones', quantity: 1 }],
    lastUpdate: 'On the truck — 6 stops away',
  },
  {
    id: 'KD-48177',
    brandId: 'fern-field',
    placedOn: 'Oct 24',
    status: 'Shipped',
    eta: 'Arriving Sat, Nov 1',
    carrier: 'DHL',
    items: [
      { productId: 'fern-merino-crew', quantity: 1 },
      { productId: 'fern-linen-throw', quantity: 1 },
    ],
    lastUpdate: 'Departed facility in Reno, NV',
  },
  {
    id: 'KD-48102',
    brandId: 'bramble-tea',
    placedOn: 'Oct 29',
    status: 'Ordered',
    eta: 'Arriving Tue, Nov 4',
    carrier: 'FedEx',
    items: [{ productId: 'bramble-sampler', quantity: 2 }],
    lastUpdate: 'Brand is preparing your order',
  },
  {
    id: 'KD-47930',
    brandId: 'ondine',
    placedOn: 'Oct 15',
    status: 'Delivered',
    eta: 'Delivered Oct 19',
    carrier: 'DHL',
    items: [{ productId: 'ondine-hoops', quantity: 1 }],
    lastUpdate: 'Left at front door',
  },
]

export const currentUser = {
  firstName: 'Carmel',
  lastName: 'Morgan',
  email: 'carmel@example.com',
  memberSince: '2024',
}
