# Kindred — build plan

1. ✅ Brand, theme (light/dark), sticky nav, generated product & editorial imagery
2. ✅ Homepage: feature banner, brand chips, order tracking cards, discovery feed with badges, curated collections, shoppable posts, recommendations, promo banners, newsletter
3. ✅ Predictive search with intent parsing + typo correction; search/browse page with filters and sort
4. ✅ Product detail, saved items, bag drawer + bag page, multi-step checkout (Stripe when configured, preview otherwise), orders page
5. ⬜ Missing routes linked from the nav: `/brands`, `/account`, `/collections/$collectionId`
6. ⬜ Netlify Database for products, brands, orders, users (replace `src/data/fixtures.ts`), served via API routes
7. ⬜ Netlify Identity accounts; sync cart/saved/history to the user
8. ⬜ AI Gateway–ranked recommendations from browsing history
9. ⬜ Brand sync: scheduled function pulling merchandising from connected stores
10. ⬜ Newsletter via Netlify Forms; Stripe webhook to record real orders
