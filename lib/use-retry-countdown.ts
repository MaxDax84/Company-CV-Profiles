"use client";

import { useEffect, useState } from "react";

// Ticks a rate-limit's Retry-After seconds down to 0, once a second, so a
// 429 error can show a live countdown instead of a static "try again
// later" — shared by every form that hits one of the Claude-calling
// rate-limited routes (see lib/rate-limit.ts).
export function useRetryCountdown() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft(s => (s !== null && s > 1 ? s - 1 : null));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return [secondsLeft, setSecondsLeft] as const;
}

// Reads the Retry-After header off a 429 response — null if missing/not a
// 429, so callers can fall back to the generic error message.
export function readRetryAfterSeconds(res: Response): number | null {
  if (res.status !== 429) return null;
  const header = res.headers.get("Retry-After");
  const seconds = header ? parseInt(header, 10) : NaN;
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}
