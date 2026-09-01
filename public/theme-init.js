// Runs before hydration so the .dark class is already set on first paint —
// without this the page would flash light mode for a returning dark-mode
// user, then flip once React mounts. Default is light: a first-time visitor
// with no saved choice gets light regardless of their OS preference: only
// an explicit 'dark' previously saved via the toggle (components/theme-toggle.tsx)
// turns dark mode on.
//
// Served as a static file (not an inline <script> in app/layout.tsx) so it
// loads under Content-Security-Policy's script-src via 'self' like any
// other same-origin script, without needing a per-request nonce — a nonce
// would require reading next/headers in the root layout, which forces every
// page in the app to opt out of static generation (see proxy.ts).
(function () {
  try {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
