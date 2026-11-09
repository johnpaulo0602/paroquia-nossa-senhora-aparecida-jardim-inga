import localFont from 'next/font/local'

/**
 * Poppins served as self-hosted woff2 from @fontsource (no request to Google at build or
 * runtime). The Latin subset covers Portuguese accents. next/font adds preload and a
 * size-adjusted fallback, so swapping fonts doesn't shift the layout.
 */
export const poppins = localFont({
  src: [
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2',
      style: 'normal',
      weight: '600',
    },
  ],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  variable: '--font-poppins',
})
