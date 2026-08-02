import type { TemplateStyle } from "./schema";

export const TEMPLATE_STYLES: TemplateStyle[] = ["alpha", "beta", "gamma", "delta"];

export const TEMPLATE_COLORS: Record<TemplateStyle, string> = {
  alpha: "#6366f1",
  beta:  "#4f46e5",
  gamma: "#10b981",
  delta: "#c9a84c",
};

export function isTemplateStyle(value: unknown): value is TemplateStyle {
  return typeof value === "string" && (TEMPLATE_STYLES as string[]).includes(value);
}

// Shared with the "profile:<slug>" KV key so a manage-link click always
// resolves to the same lifetime the /generate page promises the user.
export const PROFILE_TTL_SECONDS = 60 * 60 * 24 * 20;
