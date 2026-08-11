import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/profile-store";

export const runtime = "nodejs";

// Owner renames one of their own profile rows' address (slug) — the
// editable counterpart to the auto-generated one (see savePendingProfile).
// Rejects, rather than silently suffixing, on a collision — the user chose
// this text on purpose, so surface the conflict instead of quietly giving
// them something else.
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id;
    const rawSlug = body?.slug;
    if (typeof id !== "string" || typeof rawSlug !== "string") {
      return NextResponse.json({ error: "Missing id or slug." }, { status: 400 });
    }

    const slug = toSlug(rawSlug);
    if (!slug) {
      return NextResponse.json({ error: "Indirizzo non valido." }, { status: 400 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ slug })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Questo indirizzo è già in uso. Scegline un altro." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("[account/rename-profile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
