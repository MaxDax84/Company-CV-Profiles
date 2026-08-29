// Best-effort SSRF-guarded fetch of a job-posting URL the user pasted, plus
// a lightweight HTML→text extraction. Requires the Node runtime (uses
// `dns.promises.lookup` to catch a hostname that resolves to a private IP,
// not just a literal IP-address hostname) — both current callers
// (app/api/tailor-resume, app/api/relevance-check) already run on Node by
// default (neither declares `export const runtime = "edge"`). Never throws:
// every failure path returns { ok: false, reason }, so the caller always has
// a clean "please paste the text instead" fallback.
import { lookup as dnsLookup } from "node:dns/promises";

export type JobPostingFetchResult = { ok: true; text: string } | { ok: false; reason: string };

const MAX_RESPONSE_BYTES = 1.5 * 1024 * 1024; // 1.5MB
const MAX_EXTRACTED_CHARS = 15_000;
const FETCH_TIMEOUT_MS = 5_000;
const MAX_REDIRECTS = 3;

const PRIVATE_HOSTNAMES = new Set(["localhost", "0.0.0.0", "::1", "[::1]"]);

function isPrivateIPv4(hostname: string): boolean {
  const m = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (a === 127) return true; // loopback
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 — includes cloud metadata endpoints
  return false;
}

function isPrivateIPv6(hostname: string): boolean {
  const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (h === "::1") return true; // loopback
  if (h.startsWith("fc") || h.startsWith("fd")) return true; // fc00::/7 unique local
  if (h.startsWith("fe8") || h.startsWith("fe9") || h.startsWith("fea") || h.startsWith("feb")) return true; // fe80::/10 link-local
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (PRIVATE_HOSTNAMES.has(h)) return true;
  if (isPrivateIPv4(h)) return true;
  if (h.includes(":") && isPrivateIPv6(h)) return true;
  return false;
}

// Catches the much more common real-world case this check used to miss: a
// domain name (not a literal IP) that simply *resolves to* a private/internal
// address — e.g. a job-posting URL pointing at an attacker-controlled domain
// whose DNS record is just "169.254.169.254". Checks every resolved address,
// not just the first, since a hostname can resolve to multiple.
//
// REMAINING KNOWN LIMITATION: this doesn't pin the connection to the address
// it just validated — a true DNS-rebinding attack (the resolver returns a
// public IP for this lookup, then a private one moments later for the fetch()
// call itself) isn't caught. Closing that fully would mean resolving once and
// connecting to that exact IP via a custom fetch dispatcher, which risks
// breaking legitimate job postings served behind IP-based/SNI-sensitive CDNs
// — a real rebinding attack also requires the attacker to control DNS with a
// very short TTL and precise timing, a meaningfully harder bar than "point a
// domain at an internal IP", which is what this closes.
async function isBlockedHostnameByDns(hostname: string): Promise<boolean> {
  try {
    const results = await dnsLookup(hostname, { all: true, verbatim: true });
    return results.some(({ address }) => isPrivateIPv4(address) || isPrivateIPv6(address));
  } catch {
    // Couldn't resolve at all — let the actual fetch() below fail naturally
    // with its own "couldn't reach that URL" message, not a false block.
    return false;
  }
}

async function validateUrl(url: URL): Promise<string | null> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Only http/https URLs are supported.";
  }
  if (isBlockedHostname(url.hostname)) {
    return "That URL points at a location we can't fetch.";
  }
  if (await isBlockedHostnameByDns(url.hostname)) {
    return "That URL points at a location we can't fetch.";
  }
  return null;
}

function decodeCommonEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToText(html: string): string {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const decoded = decodeCommonEntities(stripped);
  return decoded.replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_CHARS);
}

// Reads a response body up to `MAX_RESPONSE_BYTES`, aborting the stream once
// exceeded — protects against a server lying about (or omitting)
// Content-Length.
async function readBodyCapped(res: Response): Promise<string | null> {
  const reader = res.body?.getReader();
  if (!reader) return await res.text();

  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  return text;
}

export async function fetchJobPostingText(input: string): Promise<JobPostingFetchResult> {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL." };
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const blockReason = await validateUrl(url);
    if (blockReason) return { ok: false, reason: blockReason };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; JobliBot/1.0)" },
      });
    } catch {
      return { ok: false, reason: "Couldn't reach that URL. Please paste the job description text instead." };
    } finally {
      clearTimeout(timeout);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { ok: false, reason: "That URL redirected without a destination." };
      try {
        url = new URL(location, url);
      } catch {
        return { ok: false, reason: "That URL redirected somewhere invalid." };
      }
      continue; // re-validate the new hostname on the next loop iteration
    }

    if (!res.ok) {
      return { ok: false, reason: `The page responded with an error (${res.status}).` };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return { ok: false, reason: "That URL doesn't look like a webpage." };
    }

    const contentLength = Number(res.headers.get("content-length") ?? 0);
    if (contentLength > MAX_RESPONSE_BYTES) {
      return { ok: false, reason: "That page is too large to read." };
    }

    const body = await readBodyCapped(res);
    if (body === null) {
      return { ok: false, reason: "That page is too large to read." };
    }

    const text = contentType.includes("text/html") ? htmlToText(body) : body.trim().slice(0, MAX_EXTRACTED_CHARS);
    if (text.length < 100) {
      return { ok: false, reason: "Couldn't find enough text on that page. Please paste the job description text instead." };
    }

    return { ok: true, text };
  }

  return { ok: false, reason: "That URL redirected too many times." };
}
