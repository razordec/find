/** Route an image through the Netlify Image CDN, resized and as WebP. */
export const cdn = (src: string, width: number) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=78`

/** Responsive srcset for the Netlify Image CDN. */
export const cdnSrcSet = (src: string, widths: Array<number>) =>
  widths.map((w) => `${cdn(src, w)} ${w}w`).join(', ')
