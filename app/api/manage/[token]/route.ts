import { NextRequest, NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { TEMPLATE_COLORS, isTemplateStyle } from "@/lib/templates";
import type { ProfileSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ token: string }>;
}

async function resolveSlug(token: string): Promise<string | null> {
  return kv.get<string>(`manage:${token}`);
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { token } = await params;
  const slug = await resolveSlug(token);
  if (!slug) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const template = body?.template;
  if (!isTemplateStyle(template)) {
    return NextResponse.json({ error: "Invalid template." }, { status: 400 });
  }

  const raw = await kv.get<string>(`profile:${slug}`);
  if (!raw) {
    return NextResponse.json({ error: "Profile expired." }, { status: 404 });
  }

  const profile: ProfileSchema = typeof raw === "string" ? JSON.parse(raw) : raw;
  profile.metadata.template = template;
  profile.metadata.primary_color = TEMPLATE_COLORS[template];

  // keepTtl: an edit isn't a reason to silently reset the 20-day countdown
  // the user was already told about.
  await kv.set(`profile:${slug}`, JSON.stringify(profile), { keepTtl: true });

  return NextResponse.json({ profile });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { token } = await params;
  const slug = await resolveSlug(token);
  if (!slug) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 404 });
  }

  await Promise.all([
    kv.del(`profile:${slug}`),
    kv.del(`manage:${token}`),
  ]);

  return NextResponse.json({ success: true });
}
