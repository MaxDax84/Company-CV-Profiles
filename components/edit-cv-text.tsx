"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";

interface EditCvTextProps {
  profileId: string;
  profile: ProfileSchema;
}

const MAX_BIO_LENGTH = 140;
const MAX_BULLET_LENGTH = 400;
const MAX_BULLETS_PER_EXPERIENCE = 8;

const textareaClass =
  "flex-1 min-w-0 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-3 py-2 text-xs outline-none focus:border-primary/50 resize-none";

// Direct, manual editing of a CV's own words — bio and experience bullets,
// including adding one more bullet to an existing role. No AI involved: the
// user types the exact words that get saved, so there's nothing to verify
// against a source corpus the way tailor-resume/improve-resume need to.
// Kept local-state-driven (not router.refresh()-dependent for its own
// display) so a save feels instant rather than waiting on a full page
// re-fetch.
export default function EditCvText({ profileId, profile }: EditCvTextProps) {
  const { lang } = useLanguage();
  const tr = (it: string, en: string) => (lang === "en" ? en : it);

  const [bio, setBio] = useState(profile.personal_info.bio);
  const [savedBio, setSavedBio] = useState(profile.personal_info.bio);
  const [bullets, setBullets] = useState(profile.experience.map(e => [...e.description]));
  const [newBulletDraft, setNewBulletDraft] = useState<Record<number, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send(action: object): Promise<boolean> {
    setError(null);
    try {
      const res = await fetch("/api/account/edit-cv-text", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? (lang === "en" ? "Error, try again." : "Errore, riprova."));
        return false;
      }
      return true;
    } catch {
      setError(lang === "en" ? "Network error, try again." : "Errore di rete, riprova.");
      return false;
    }
  }

  async function saveBio() {
    const value = bio.trim();
    if (!value || value === savedBio) return;
    setBusyKey("bio");
    if (await send({ type: "bio", value })) setSavedBio(value);
    setBusyKey(null);
  }

  async function saveBullet(expIndex: number, bulletIndex: number) {
    const value = bullets[expIndex][bulletIndex].trim();
    const original = profile.experience[expIndex].description[bulletIndex];
    if (!value || value === original) return;
    const key = `bullet-${expIndex}-${bulletIndex}`;
    setBusyKey(key);
    await send({ type: "bullet", experienceIndex: expIndex, bulletIndex, value });
    setBusyKey(null);
  }

  async function addBullet(expIndex: number) {
    const value = (newBulletDraft[expIndex] ?? "").trim();
    if (!value) return;
    const key = `add-${expIndex}`;
    setBusyKey(key);
    const ok = await send({ type: "add_bullet", experienceIndex: expIndex, value });
    if (ok) {
      const next = [...bullets];
      next[expIndex] = [...next[expIndex], value];
      setBullets(next);
      setNewBulletDraft({ ...newBulletDraft, [expIndex]: "" });
    }
    setBusyKey(null);
  }

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Bio</label>
        <div className="flex items-start gap-2">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={MAX_BIO_LENGTH}
            rows={2}
            className={textareaClass}
          />
          <button
            type="button"
            onClick={saveBio}
            disabled={busyKey === "bio" || !bio.trim() || bio.trim() === savedBio}
            aria-label={tr("Salva", "Save")}
            className="shrink-0 p-2 rounded-lg text-primary disabled:opacity-30 transition-opacity"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/40 text-right">{bio.length}/{MAX_BIO_LENGTH}</p>
      </div>

      {profile.experience.map((exp, expIndex) => (
        <div key={expIndex} className="space-y-2 border-t border-foreground/10 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            {exp.role} · {exp.company}
          </p>
          {bullets[expIndex].map((bulletText, bulletIndex) => (
            <div key={bulletIndex} className="flex items-start gap-2">
              <textarea
                value={bulletText}
                onChange={e => {
                  const next = bullets.map(arr => [...arr]);
                  next[expIndex][bulletIndex] = e.target.value;
                  setBullets(next);
                }}
                maxLength={MAX_BULLET_LENGTH}
                rows={2}
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() => saveBullet(expIndex, bulletIndex)}
                disabled={
                  busyKey === `bullet-${expIndex}-${bulletIndex}` ||
                  !bulletText.trim() ||
                  bulletText.trim() === profile.experience[expIndex].description[bulletIndex]
                }
                aria-label={tr("Salva", "Save")}
                className="shrink-0 p-2 rounded-lg text-primary disabled:opacity-30 transition-opacity"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ))}
          {bullets[expIndex].length < MAX_BULLETS_PER_EXPERIENCE && (
            <div className="flex items-start gap-2">
              <textarea
                value={newBulletDraft[expIndex] ?? ""}
                onChange={e => setNewBulletDraft({ ...newBulletDraft, [expIndex]: e.target.value })}
                placeholder={tr("Aggiungi un punto…", "Add a bullet point…")}
                maxLength={MAX_BULLET_LENGTH}
                rows={1}
                className={`${textareaClass} border-dashed`}
              />
              <button
                type="button"
                onClick={() => addBullet(expIndex)}
                disabled={busyKey === `add-${expIndex}` || !(newBulletDraft[expIndex] ?? "").trim()}
                className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold text-primary disabled:opacity-30 transition-opacity whitespace-nowrap"
              >
                {tr("+ Aggiungi", "+ Add")}
              </button>
            </div>
          )}
        </div>
      ))}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
