import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { parseResume } from "@/lib/parse-resume";

// Converts "Mario Rossi" → "mario-rossi", with collision suffix if needed
function toSlug(fullName: string): string {
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 10 MB" }, { status: 413 });
    }

    const templateChoice = formData.get("template");

    const buffer = Buffer.from(await file.arrayBuffer());
    const profile = await parseResume(buffer);

    // User's choice always wins over the AI suggestion
    const TEMPLATE_COLORS: Record<string, string> = {
      alpha: "#6366f1",
      beta:  "#4f46e5",
      gamma: "#10b981",
      delta: "#c9a84c",
    };
    if (templateChoice && ["alpha", "beta", "gamma", "delta"].includes(templateChoice as string)) {
      profile.metadata.template = templateChoice as import("@/lib/schema").TemplateStyle;
      profile.metadata.primary_color = TEMPLATE_COLORS[templateChoice as string];
    }

    // Generate unique slug
    const baseSlug = toSlug(profile.personal_info.full_name) || "profile";
    let slug = baseSlug;
    let attempt = 0;
    while (await kv.exists(`profile:${slug}`)) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    await kv.set(`profile:${slug}`, JSON.stringify(profile));

    return NextResponse.json({ slug, profile });
  } catch (err) {
    console.error("[parse-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
