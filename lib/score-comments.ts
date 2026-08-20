// Specific, score-range-dependent commentary for the teaser score card (see
// components/cv-score-card.tsx) — replaces one generic "this is just the
// starting point" line that showed regardless of whether the CV scored 10
// or 90, which read as tone-deaf at the extremes.

export function getScoreComment(score: number, lang: "it" | "en" = "it"): string {
  if (lang === "en") {
    if (score < 40) {
      return "This CV still has a long way to go: measurable results are missing and the structure isn't optimized for automated filters. Our AI can raise it a lot without inventing anything.";
    }
    if (score < 60) {
      return "A decent starting point, but with real room for improvement — especially around numbers and quantified results.";
    }
    if (score < 75) {
      return "Almost there: a bit more work on clarity and concrete results can get you close to the typical threshold for passing ATS filters.";
    }
    if (score < 90) {
      return "Already a solid CV, above the typical threshold ATS filters look for — we can still refine it to make it truly stand out.";
    }
    return "An excellent CV, well above the typical ATS threshold. We can still polish a few details to make it perfect.";
  }
  if (score < 40) {
    return "Il CV ha ancora molta strada da fare: mancano risultati misurabili e la struttura non è ottimizzata per i filtri automatici. La nostra AI può alzarlo parecchio senza inventare nulla.";
  }
  if (score < 60) {
    return "Un punto di partenza discreto, ma con margini concreti di miglioramento — soprattutto su numeri e risultati quantificati.";
  }
  if (score < 75) {
    return "Ci siamo quasi: con qualche accorgimento in più su chiarezza e risultati concreti puoi avvicinarti alla soglia tipica per superare i filtri ATS.";
  }
  if (score < 90) {
    return "Un CV già solido, sopra la soglia tipica richiesta dai filtri ATS — possiamo ancora rifinirlo per renderlo davvero distintivo.";
  }
  return "Un CV eccellente, ben oltre la soglia tipica richiesta dai filtri ATS. Possiamo ancora limare qualche dettaglio per renderlo perfetto.";
}

// Not a literal guarantee from any specific ATS vendor (there's no single
// universal number — behavior varies per system) — this is our own 100-point
// rubric's own indicative threshold, shown so the score means something
// concrete rather than just being a bare number out of 100.
export const ATS_TARGET_SCORE = 70;
