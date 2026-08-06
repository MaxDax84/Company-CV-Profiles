import { notFound } from "next/navigation";
import type { ProfileSchema, TemplateStyle } from "@/lib/schema";
import { TemplateAlpha, TemplateBeta, TemplateGamma, TemplateDelta } from "@/components/templates";
import { getProfileBySlug } from "@/lib/profile-store";

const TEMPLATE_MAP: Record<TemplateStyle, React.ComponentType<{ profile: ProfileSchema }>> = {
  alpha: TemplateAlpha,  // Inter · dark · timeline
  beta:  TemplateBeta,   // DM Serif · indigo su bianco
  gamma: TemplateGamma,  // Jakarta · emerald · hero scuro
  delta: TemplateDelta,  // Playfair · gold su navy
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) notFound();

  const Template = TEMPLATE_MAP[profile.metadata.template] ?? TemplateAlpha;

  return <Template profile={profile} />;
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
