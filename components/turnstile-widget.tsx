"use client";

import Script from "next/script";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

// Cloudflare's own widget can silently hang — an ad-blocker or third-party
// cookie restriction (Safari ITP, Brave Shields) blocking
// challenges.cloudflare.com doesn't reliably fire Turnstile's own
// error-callback, so from the user's side a real failure looks identical to
// "still loading". Without this, the UI just kept showing "un attimo" (one
// moment) forever with no way to tell it was stuck or to retry.
const STUCK_TIMEOUT_MS = 15000;

const TurnstileWidget = forwardRef<TurnstileHandle, {
  onVerify: (token: string | null) => void;
  language?: string;
}>(function TurnstileWidget({ onVerify, language }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "stuck">("loading");
  const [renderKey, setRenderKey] = useState(0);
  const isIt = language !== "en";

  function reset() {
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      setStatus("loading");
    } else {
      // The widget never actually mounted (e.g. the script itself never
      // loaded) — nothing to reset, force a full remount instead.
      setRenderKey((k) => k + 1);
      setStatus("loading");
    }
  }

  useImperativeHandle(ref, () => ({ reset }));

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.turnstile) return;

    setStatus("loading");
    const id = window.turnstile.render(containerRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      theme: "auto",
      language,
      callback: (token: string) => {
        setStatus("ready");
        onVerify(token);
      },
      "expired-callback": () => {
        setStatus("loading");
        onVerify(null);
      },
      "error-callback": () => {
        setStatus("stuck");
        onVerify(null);
      },
    });
    widgetId.current = id;

    const timeout = setTimeout(() => {
      setStatus((s) => (s === "loading" ? "stuck" : s));
    }, STUCK_TIMEOUT_MS);

    return () => {
      clearTimeout(timeout);
      if (window.turnstile) window.turnstile.remove(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, language, renderKey]);

  return (
    <div className="flex flex-col items-center gap-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div key={renderKey} ref={containerRef} />
      {status === "stuck" && (
        <div className="flex flex-col items-center gap-1.5 text-center max-w-xs">
          <p className="text-xs" style={{ color: "rgba(251,191,36,0.9)" }}>
            {isIt
              ? "La verifica anti-spam sta impiegando più del previsto. Se hai un ad-blocker attivo, prova a disattivarlo."
              : "The anti-spam check is taking longer than expected. If you have an ad-blocker enabled, try disabling it."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-semibold underline underline-offset-2"
            style={{ color: "var(--primary)" }}
          >
            {isIt ? "Riprova" : "Try again"}
          </button>
        </div>
      )}
    </div>
  );
});

export default TurnstileWidget;
