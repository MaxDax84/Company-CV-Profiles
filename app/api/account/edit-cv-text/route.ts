import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProfileSchema } from "@/lib/schema";

export const runtime = "nodejs";

const MAX_BIO_LENGTH = 140;
const MAX_BULLET_LENGTH = 400;
const MAX_BULLETS_PER_EXPERIENCE = 8;

type EditAction =
  | { type: "bio"; value: string }
  | { type: "bullet"; experienceIndex: number; bulletIndex: number; value: string }
  | { type: "add_bullet"; experienceIndex: number; value: string };

// Direct, manual text edits to an existing primary CV — bio, or a single
// experience bullet, or a new bullet appended to an existing experience.
// Deliberately NOT going through any AI call: the user is typing the words
// themselves, so there's no anti-fabrication concern the way there is for
// improve-resume/tailor-resume. Also deliberately narrow: this can only
// change WORDS within fields that already exist (or append one more bullet
// to an existing list) — it can never add a new experience/education/
// project entry or any other structural section.
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const profileId = body?.profileId;
    const action = body?.action as EditAction | undefined;
    if (typeof profileId !== "string" || !action || typeof action.type !== "string") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Only ever a primary CV — the only kind with a public profile page.
    const { data: row } = await supabase
      .from("profiles")
      .select("id, data")
      .eq("id", profileId)
      .eq("user_id", user.id)
      .eq("kind", "primary")
      .maybeSingle();
    if (!row) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const profile = row.data as ProfileSchema;

    if (action.type === "bio") {
      const value = typeof action.value === "string" ? action.value.trim().slice(0, MAX_BIO_LENGTH) : "";
      if (!value) {
        return NextResponse.json({ error: "La bio non può essere vuota." }, { status: 400 });
      }
      profile.personal_info.bio = value;
    } else if (action.type === "bullet") {
      const exp = profile.experience[action.experienceIndex];
      if (!exp || action.bulletIndex < 0 || action.bulletIndex >= exp.description.length) {
        return NextResponse.json({ error: "Voce non trovata." }, { status: 400 });
      }
      const value = typeof action.value === "string" ? action.value.trim().slice(0, MAX_BULLET_LENGTH) : "";
      if (!value) {
        return NextResponse.json({ error: "Il testo non può essere vuoto." }, { status: 400 });
      }
      exp.description[action.bulletIndex] = value;
    } else if (action.type === "add_bullet") {
      const exp = profile.experience[action.experienceIndex];
      if (!exp) {
        return NextResponse.json({ error: "Esperienza non trovata." }, { status: 400 });
      }
      if (exp.description.length >= MAX_BULLETS_PER_EXPERIENCE) {
        return NextResponse.json({ error: `Massimo ${MAX_BULLETS_PER_EXPERIENCE} punti per esperienza.` }, { status: 400 });
      }
      const value = typeof action.value === "string" ? action.value.trim().slice(0, MAX_BULLET_LENGTH) : "";
      if (!value) {
        return NextResponse.json({ error: "Il testo non può essere vuoto." }, { status: 400 });
      }
      exp.description.push(value);
    } else {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ data: profile })
      .eq("id", profileId)
      .eq("user_id", user.id);
    if (error) throw error;

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("[account/edit-cv-text]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
