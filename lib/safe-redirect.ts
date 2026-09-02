// Guards against open-redirect: a "next" query param carried through
// login/signup is attacker-controlled (anyone can craft the link), so only
// ever honor a same-origin relative path — never a bare "//host/..." (which
// browsers treat as protocol-relative to an arbitrary host) or an absolute
// URL to another domain.
export function safeRedirectPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}
