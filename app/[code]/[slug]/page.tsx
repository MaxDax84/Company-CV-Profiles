import { notFound } from "next/navigation";
import type { ProfileSchema, TemplateStyle } from "@/lib/schema";
import { TemplateAlpha, TemplateBeta, TemplateGamma, TemplateDelta } from "@/components/templates";
import { getProfileByAccountCode, getOwnedProfileBySlug } from "@/lib/profile-store";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
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
async function getOwnerInfo(slug: string): Promise<{ kind: "primary" | "tailored" | "translated" } | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const row = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (!row) return null;
    return { kind: row.kind };
  } catch {
    return null;
  }
}

export default async function AccountProfilePage({ params }: Props) {
  const { code, slug } = await params;
  const [result, ownerInfo] = await Promise.all([getProfileByAccountCode(code, slug), getOwnerInfo(slug)]);

  if (!result) notFound();
  // A page the owner has taken private (see 0018_profile_visibility) still
  // renders for the owner themselves — otherwise there'd be no way to
  // preview it — but 404s for anyone else, same as it not existing at all.
  if (!result.isPublic && !ownerInfo) notFound();

  const profile = result.profile;
  const Template = TEMPLATE_MAP[profile.metadata.template] ?? TemplateAlpha;

  return (
    <>
      {ownerInfo && <OwnerToolbar kind={ownerInfo.kind} />}
      <Template profile={profile} />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { code, slug } = await params;
  const result = await getProfileByAccountCode(code, slug);
  if (!result) return {};

  const { full_name, title } = result.profile.personal_info;

  return {
    title: `${full_name} — ${title}`,
    description: result.profile.personal_info.bio,
    // Meant to be reachable by direct link (shared with a recruiter), not
    // publicly searchable — a CV's personal/professional details shouldn't
    // end up in a search index just because the page exists.
    robots: { index: false, follow: false },
  };
}
