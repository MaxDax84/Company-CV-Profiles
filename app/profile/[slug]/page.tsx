import { notFound } from "next/navigation";
import type { ProfileSchema, TemplateStyle } from "@/lib/schema";
import { TemplateAlpha, TemplateBeta, TemplateGamma, TemplateDelta } from "@/components/templates";
import { getProfileBySlug, getOwnedProfileBySlug } from "@/lib/profile-store";
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
  params: Promise<{ slug: string }>;
}

// Null for anyone but the profile's own owner — a visitor opening the
// shared link, or an anonymous/pending preview, never triggers this.
async function getOwnerKind(slug: string): Promise<"primary" | "tailored" | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const row = await getOwnedProfileBySlug(supabase, user.id, slug);
    return row?.kind ?? null;
  } catch {
    return null;
  }
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const [profile, ownerKind] = await Promise.all([getProfileBySlug(slug), getOwnerKind(slug)]);

  if (!profile) notFound();

  const Template = TEMPLATE_MAP[profile.metadata.template] ?? TemplateAlpha;

  return (
    <>
      {ownerKind && <OwnerToolbar slug={slug} kind={ownerKind} />}
      <Template profile={profile} />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return {};

  const { full_name, title } = profile.personal_info;

  return {
    title: `${full_name} — ${title}`,
    description: profile.personal_info.bio,
  };
}
