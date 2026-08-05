interface Step {
  label: string;
  done: boolean;
}

export default function StepProgress({ steps, accent }: { steps: Step[]; accent: string }) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <div key={step.label} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors duration-300 shrink-0"
              style={step.done
                ? { background: accent, borderColor: accent, color: "#000" }
                : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)" }}
            >
              {step.done ? (
                <svg width="10" height="10" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3.5 6L6.5 2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className="text-[11px] font-medium whitespace-nowrap transition-colors duration-300"
              style={{ color: step.done ? accent : "rgba(255,255,255,0.4)" }}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-[2px] mx-3 rounded-full transition-colors duration-300"
              style={{ background: step.done ? accent : "rgba(255,255,255,0.1)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
