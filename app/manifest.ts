import type { MetadataRoute } from 'next'

// Without this, "Add to Home Screen" / "Install app" on Android has no icon
// to install from and falls back to a generated monogram (a letter tile
// built from the page title) instead of the real mascot — the favicon file
// alone only covers the browser tab, not the installed-app icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jobli',
    short_name: 'Jobli',
    description: 'Jobli usa l\'AI per trasformare il tuo CV in un profilo pronto per candidarti.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#123bff',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
