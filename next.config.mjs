/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Applies to every route. Not a CSP (the app pulls in the Turnstile
        // script plus per-page inline hydration data, so a strict
        // script-src would need real auditing to get right) — these are
        // the cheap, safe-by-default ones.
        source: '/(.*)',
        headers: [
          // Clickjacking: no page here is meant to be framed by another site.
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stops the browser from MIME-sniffing a response into executing
          // as something other than its declared Content-Type.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Don't leak the full referring URL (which can contain slugs/
          // account codes) to third-party destinations.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}
export default nextConfig
