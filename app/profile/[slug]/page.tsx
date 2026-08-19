import { notFound } from "next/navigation";
import type { ProfileSchema, TemplateStyle } from "@/lib/schema";
import { TemplateAlpha, TemplateBeta, TemplateGamma, TemplateDelta } from "@/components/templates";
import { getProfileBySlug } from "@/lib/profile-store";

const TEMPLATE_MAP: Record<TemplateStyle, React.ComponentType<{ profile: ProfileSchema; forceVisible?: boolean }>> = {
  alpha: TemplateAlpha,  // Inter · dark · timeline
  beta:  TemplateBeta,   // DM Serif · indigo su bianco
  gamma: TemplateGamma,  // Jakarta · emerald · hero scuro
  delta: TemplateDelta,  // Playfair · gold su navy
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

// Only ever serves a still-pending (unclaimed) preview or a seeded demo/
// showcase profile — both KV-only. A claimed profile's permanent address
// is /<account-code>/<slug> (see app/[code]/[slug]/page.tsx), so there's
// never an owner to show a toolbar for here.
export default async function PendingProfilePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const profile = await getProfileBySlug(slug);

  if (!profile) notFound();

  const Template = TEMPLATE_MAP[profile.metadata.template] ?? TemplateAlpha;

  // ?preview=1: used only by the small animated before/after iframe on
  // /generate, whose CSS-transform "scroll" never moves the iframe's real
  // scroll position — so the templates' scroll-triggered fade-ins would
  // otherwise stay permanently invisible below the iframe's fixed viewport
  // height (see the forceVisible comment in each Template's useInView).
  return <Template profile={profile} forceVisible={preview === "1"} />;
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
