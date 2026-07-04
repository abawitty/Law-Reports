export const FONT_SIZES = ["sm", "base", "lg", "xl", "2xl", "3xl"] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const TEXT_COLORS = ["default", "muted", "green", "red", "white"] as const;
export type TextColor = (typeof TEXT_COLORS)[number];

export const ALIGNMENTS = ["left", "center", "right"] as const;
export type Align = (typeof ALIGNMENTS)[number];

export const IMAGE_WIDTHS = ["small", "medium", "full"] as const;
export type ImageWidth = (typeof IMAGE_WIDTHS)[number];

export const SPACER_SIZES = ["sm", "md", "lg"] as const;
export type SpacerSize = (typeof SPACER_SIZES)[number];

export const BUTTON_STYLES = ["primary", "secondary"] as const;
export type ButtonStyle = (typeof BUTTON_STYLES)[number];

export type HeadingBlock = {
  id: string;
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
  size: FontSize;
  color: TextColor;
  align: Align;
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  text: string;
  size: FontSize;
  color: TextColor;
  align: Align;
  bold: boolean;
};

export type ImageBlock = {
  id: string;
  type: "image";
  imageId: string | null;
  caption: string;
  width: ImageWidth;
};

export type ButtonBlock = {
  id: string;
  type: "button";
  label: string;
  href: string;
  style: ButtonStyle;
};

export type SpacerBlock = {
  id: string;
  type: "spacer";
  size: SpacerSize;
};

export type Block = HeadingBlock | ParagraphBlock | ImageBlock | ButtonBlock | SpacerBlock;
export type BlockType = Block["type"];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "heading":
      return { id, type, text: "New heading", level: 2, size: "2xl", color: "default", align: "left" };
    case "paragraph":
      return { id, type, text: "New paragraph text.", size: "base", color: "default", align: "left", bold: false };
    case "image":
      return { id, type, imageId: null, caption: "", width: "medium" };
    case "button":
      return { id, type, label: "Click here", href: "/", style: "primary" };
    case "spacer":
      return { id, type, size: "md" };
  }
}

export function isBlockArray(value: unknown): value is Block[] {
  return Array.isArray(value);
}
