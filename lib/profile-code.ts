// A short, human-readable "system code" shown alongside a profile's real
// address — the classic internal reference number pattern. Derived
// deterministically from the profile's own (already-unique) Postgres row
// id, so it needs no new column, no migration, and no generation-time
// collision handling: the same profile always shows the same code.
export function deriveProfileCode(id: string): string {
  const hex = id.replace(/-/g, "").slice(0, 8);
  const num = parseInt(hex, 16) % 10_000_000;
  return String(num).padStart(7, "0");
}
