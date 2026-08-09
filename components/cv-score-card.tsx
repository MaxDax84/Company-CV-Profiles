import type { CvScoreBreakdown } from "@/lib/cv-score";

interface CvScoreCardProps {
  before: CvScoreBreakdown | null;
  after: CvScoreBreakdown;
  accentColor: string;
  labels: {
    title: string;
    quantifiedResults: string;
    clarity: string;
    atsStructure: string;
    specificSkills: string;
    beforeLabel: string;
    afterLabel: string;
  };
}

const CRITERIA: { key: keyof Omit<CvScoreBreakdown, "total">; labelKey: keyof CvScoreCardProps["labels"] }[] = [
  { key: "quantifiedResults", labelKey: "quantifiedResults" },
  { key: "clarity", labelKey: "clarity" },
  { key: "atsStructure", labelKey: "atsStructure" },
  { key: "specificSkills", labelKey: "specificSkills" },
];

export default function CvScoreCard({ before, after, accentColor, labels }: CvScoreCardProps) {
  const delta = before ? after.total - before.total : null;

  return (
    <div className="text-left rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 text-center">
        {labels.title}
      </p>

      {/* Big before -> after totals */}
      <div className="flex items-center justify-center gap-4">
        {before && (
          <>
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground/50">{before.total}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40">{labels.beforeLabel}</p>
            </div>
            <span className="text-2xl text-muted-foreground/30">→</span>
          </>
        )}
        <div className="text-center">
          <p className="font-heading text-4xl font-bold" style={{ color: accentColor }}>{after.total}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40">{labels.afterLabel}</p>
        </div>
        {delta !== null && delta > 0 && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ color: accentColor, background: `${accentColor}18` }}
          >
            +{delta}
          </span>
        )}
      </div>

      {/* Per-criterion bars */}
      <div className="space-y-3">
        {CRITERIA.map(({ key, labelKey }) => {
          const afterVal = after[key];
          const beforeVal = before?.[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{labels[labelKey]}</span>
                <span className="text-xs font-semibold text-muted-foreground/70">
                  {beforeVal !== undefined ? `${beforeVal} → ` : ""}{afterVal}/25
                </span>
              </div>
              <div className="relative h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                {beforeVal !== undefined && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white/15"
                    style={{ width: `${(beforeVal / 25) * 100}%` }}
                  />
                )}
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${(afterVal / 25) * 100}%`, background: accentColor, opacity: 0.85 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
