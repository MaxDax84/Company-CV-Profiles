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
