import { notFound } from "next/navigation";
import type { ProfileSchema, TemplateStyle } from "@/lib/schema";
import { TemplateAlpha, TemplateBeta, TemplateGamma, TemplateDelta } from "@/components/templates";
import { getProfileByAccountCode, getOwnedProfileBySlug } from "@/lib/profile-store";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getCreditBalance } from "@/lib/credits";
import OwnerToolbar from "@/components/owner-toolbar";

const TEMPLATE_MAP: Record<TemplateStyle, React.ComponentType<{ profile: ProfileSchema }>> = {
  alpha: TemplateAlpha,  // Inter · dark · timeline
  beta:  TemplateBeta,   // DM Serif · indigo su bianco
  gamma: TemplateGamma,  // Jakarta · emerald · hero scuro
  delta: TemplateDelta,  // Playfair · gold su navy
};

interface Props {
  params: Promise<{ code: string; slug: string }>;
}

// Null for anyone but this exact profile's own owner — a visitor opening
// the shared link never triggers this. The account `code` in the URL isn't
// needed here: ownership only depends on whether the *currently signed-in*
// user owns a profile with this slug, same check regardless of whose code
// got them to this page.
async function getOwnerInfo(slug: string): Promise<{ kind: "primary" | "tailored"; credits: number } | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const row = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (!row) return null;
    const credits = await getCreditBalance(supabase, user.id);
    return { kind: row.kind, credits };
  } catch {
    return null;
  }
}

export default async function AccountProfilePage({ params }: Props) {
  const { code, slug } = await params;
  const [profile, ownerInfo] = await Promise.all([getProfileByAccountCode(code, slug), getOwnerInfo(slug)]);

  if (!profile) notFound();

  const Template = TEMPLATE_MAP[profile.metadata.template] ?? TemplateAlpha;

  return (
    <>
      {ownerInfo && <OwnerToolbar slug={slug} kind={ownerInfo.kind} credits={ownerInfo.credits} />}
      <Template profile={profile} />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { code, slug } = await params;
  const profile = await getProfileByAccountCode(code, slug);
  if (!profile) return {};

  const { full_name, title } = profile.personal_info;

  return {
    title: `${full_name} — ${title}`,
    description: profile.personal_info.bio,
  };
}
