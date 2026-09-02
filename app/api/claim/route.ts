import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { claimPendingProfile } from "@/lib/profile-store";
import { getAccountCode } from "@/lib/credits";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json();
    const claimToken = body?.claimToken;
    if (typeof claimToken !== "string" || !claimToken) {
      return NextResponse.json({ error: "Missing claim token." }, { status: 400 });
    }

    const result = await claimPendingProfile(supabase, user.id, claimToken);

    if ("error" in result) {
      if (result.error === "expired") {
        return NextResponse.json(
          { error: "This preview has expired — generate your CV again." },
          { status: 410 }
        );
      }
      if (result.error === "cv_limit_reached") {
        return NextResponse.json(
          {
            error: "Hai raggiunto il limite di 4 CV per account. Elimina uno dei CV esistenti per poterne aggiungere uno nuovo.",
            code: "CV_LIMIT_REACHED",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Could not save this profile to your account. Please try again." },
        { status: 500 }
      );
    }

    const code = await getAccountCode(supabase, user.id);
    return NextResponse.json({ slug: result.slug, code });
  } catch (err) {
    console.error("[claim]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
