import { kv } from "@/lib/kv";
import type { ProfileSchema } from "@/lib/schema";
import { translations } from "@/lib/i18n";
import ManageProfileClient from "@/components/manage-profile-client";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ManagePage({ params }: Props) {
  const { token } = await params;
  const slug = await kv.get<string>(`manage:${token}`);
  const raw = slug ? await kv.get<string>(`profile:${slug}`) : null;

  if (!slug || !raw) {
    const t = translations.en.manage;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">🔗</div>
          <h1 className="text-xl font-semibold">{t.invalidTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.invalidSubtitle}</p>
          <a href="/" className="inline-block text-sm text-primary hover:underline">{t.backHome}</a>
        </div>
      </div>
    );
  }

  const profile: ProfileSchema = typeof raw === "string" ? JSON.parse(raw) : raw;

  return <ManageProfileClient token={token} slug={slug} profile={profile} />;
}
