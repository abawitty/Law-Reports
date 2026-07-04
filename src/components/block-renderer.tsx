import type { Block } from "@/lib/blocks";
import { ALIGN_CLASSES, FONT_SIZE_CLASSES, TEXT_COLOR_CLASSES } from "@/lib/block-styles";

const IMAGE_WIDTH_CLASSES = {
  small: "max-w-xs",
  medium: "max-w-xl",
  full: "max-w-none w-full",
};

const SPACER_HEIGHT_CLASSES = {
  sm: "h-4",
  md: "h-10",
  lg: "h-20",
};

const HEADING_TAGS = { 1: "h1", 2: "h2", 3: "h3" } as const;

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const Tag = HEADING_TAGS[block.level];
            return (
              <Tag
                key={block.id}
                className={`font-bold tracking-tight ${FONT_SIZE_CLASSES[block.size]} ${TEXT_COLOR_CLASSES[block.color]} ${ALIGN_CLASSES[block.align]}`}
              >
                {block.text}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p
                key={block.id}
                className={`whitespace-pre-wrap ${FONT_SIZE_CLASSES[block.size]} ${TEXT_COLOR_CLASSES[block.color]} ${ALIGN_CLASSES[block.align]} ${block.bold ? "font-semibold" : ""}`}
              >
                {block.text}
              </p>
            );
          case "image":
            if (!block.imageId) return null;
            return (
              <figure key={block.id} className="mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/page-image/${block.imageId}`}
                  alt={block.caption || ""}
                  className={`mx-auto rounded-lg ${IMAGE_WIDTH_CLASSES[block.width]}`}
                />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-gray-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "button":
            return (
              <div key={block.id}>
                <a
                  href={block.href}
                  className={
                    block.style === "primary"
                      ? "inline-block rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
                      : "inline-block rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  }
                >
                  {block.label}
                </a>
              </div>
            );
          case "spacer":
            return <div key={block.id} className={SPACER_HEIGHT_CLASSES[block.size]} />;
        }
      })}
    </div>
  );
}
