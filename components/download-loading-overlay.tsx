import { useLanguage } from "@/components/language-provider";

interface DownloadLoadingOverlayProps {
  label: string;
  // 0-100 — when given, renders an advancing progress bar instead of the
  // plain "usually takes a few seconds" note. For longer operations (e.g.
  // interview-prep's real web research calls) a bar that visibly moves reads
  // as "working", where a static spinner alone starts to feel stuck after
  // more than a few seconds.
  progress?: number;
}

// Full-screen, blocking loading state shown while a PDF is being generated
// server-side and streamed down — a plain `window.location.href` download
// gives the user zero feedback for however long that takes, which reads as
// "did my click even register?". `fixed inset-0` blocks interaction with
// the rest of the page until it's dismissed by the caller.
export default function DownloadLoadingOverlay({ label, progress }: DownloadLoadingOverlayProps) {
  const { lang } = useLanguage();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-card rounded-2xl p-8 max-w-xs w-full space-y-4 text-center">
        <div className="relative mx-auto w-14 h-14">
          <div
            className="absolute inset-0 rounded-full border-[3px] border-foreground/15 animate-spin"
            style={{ borderTopColor: "var(--primary)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size mark, same as the nav logo */}
          <img src="/icon.png" alt="" className="absolute inset-0 m-auto w-7 h-7 rounded-md" />
        </div>
        <p className="text-sm font-semibold">{label}</p>
        {progress != null ? (
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%`, background: "var(--primary)" }}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {lang === "en" ? "Don't close this page, it usually takes a few seconds." : "Non chiudere questa pagina, ci vogliono in genere pochi secondi."}
          </p>
        )}
      </div>
    </div>
  );
}
