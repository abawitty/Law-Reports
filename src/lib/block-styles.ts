import type { Align, FontSize, TextColor } from "@/lib/blocks";

export const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

export const TEXT_COLOR_CLASSES: Record<TextColor, string> = {
  default: "text-gray-900",
  muted: "text-gray-600",
  green: "text-brand-green-dark",
  red: "text-brand-red",
  white: "text-white",
};

export const ALIGN_CLASSES: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  sm: "Small",
  base: "Normal",
  lg: "Large",
  xl: "X-Large",
  "2xl": "XX-Large",
  "3xl": "Huge",
};

export const TEXT_COLOR_LABELS: Record<TextColor, string> = {
  default: "Black",
  muted: "Gray",
  green: "Green",
  red: "Red",
  white: "White",
};
