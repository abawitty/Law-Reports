"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALIGNMENTS,
  BUTTON_STYLES,
  createBlock,
  FONT_SIZES,
  IMAGE_WIDTHS,
  SPACER_SIZES,
  TEXT_COLORS,
  type Align,
  type Block,
  type BlockType,
  type ButtonStyle,
  type FontSize,
  type ImageWidth,
  type SpacerSize,
  type TextColor,
} from "@/lib/blocks";
import { FONT_SIZE_LABELS, TEXT_COLOR_LABELS } from "@/lib/block-styles";

type PageData = {
  id: string;
  title: string;
  slug: string;
  navLabel: string;
  navOrder: number;
  published: boolean;
  blocks: Block[];
};

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  button: "Button",
  spacer: "Spacer",
};

function fieldClass() {
  return "rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green";
}

export function PageBuilder({ page }: { page: PageData }) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [navLabel, setNavLabel] = useState(page.navLabel);
  const [navOrder, setNavOrder] = useState(page.navOrder);
  const [published, setPublished] = useState(page.published);
  const [blocks, setBlocks] = useState<Block[]>(page.blocks);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)),
    );
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, createBlock(type)]);
  }

  function reorder(from: number, to: number) {
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, navLabel, navOrder, published, blocks }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save page");
      return;
    }
    setSavedAt(Date.now());
    router.refresh();
  }

  async function handleDeletePage() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await fetch(`/api/admin/pages/${page.id}`, { method: "DELETE" });
    router.push("/dashboard/admin/content/pages");
  }

  async function uploadImage(file: File, blockId: string) {
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/page-images", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (res.ok) updateBlock(blockId, { imageId: data.id } as Partial<Block>);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 p-5">
        <h2 className="font-semibold text-gray-900">Page settings</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-gray-600">Page title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 w-full ${fieldClass()}`}
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-600">Menu label</span>
            <input
              value={navLabel}
              onChange={(e) => setNavLabel(e.target.value)}
              className={`mt-1 w-full ${fieldClass()}`}
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-600">Menu position (lower = earlier)</span>
            <input
              type="number"
              value={navOrder}
              onChange={(e) => setNavOrder(Number(e.target.value))}
              className={`mt-1 w-full ${fieldClass()}`}
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-gray-700">
              Published (visible on the site and in the menu)
            </span>
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">Public URL: /p/{page.slug}</p>
      </div>

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex.current !== null && dragIndex.current !== index) {
                reorder(dragIndex.current, index);
              }
              dragIndex.current = null;
            }}
            className="cursor-move rounded-xl border border-black/10 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <span aria-hidden>⠿</span>
                {BLOCK_TYPE_LABELS[block.type]}
              </span>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="text-xs font-medium text-brand-red hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="mt-3">
              {block.type === "heading" && (
                <div className="space-y-2">
                  <input
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    className={`w-full ${fieldClass()}`}
                  />
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={block.level}
                      onChange={(e) =>
                        updateBlock(block.id, { level: Number(e.target.value) as 1 | 2 | 3 })
                      }
                      className={fieldClass()}
                    >
                      <option value={1}>Heading 1</option>
                      <option value={2}>Heading 2</option>
                      <option value={3}>Heading 3</option>
                    </select>
                    <SizeSelect value={block.size} onChange={(size) => updateBlock(block.id, { size })} />
                    <ColorSelect value={block.color} onChange={(color) => updateBlock(block.id, { color })} />
                    <AlignSelect value={block.align} onChange={(align) => updateBlock(block.id, { align })} />
                  </div>
                </div>
              )}

              {block.type === "paragraph" && (
                <div className="space-y-2">
                  <textarea
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    rows={4}
                    className={`w-full ${fieldClass()}`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <SizeSelect value={block.size} onChange={(size) => updateBlock(block.id, { size })} />
                    <ColorSelect value={block.color} onChange={(color) => updateBlock(block.id, { color })} />
                    <AlignSelect value={block.align} onChange={(align) => updateBlock(block.id, { align })} />
                    <label className="flex items-center gap-1 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={block.bold}
                        onChange={(e) => updateBlock(block.id, { bold: e.target.checked })}
                      />
                      Bold
                    </label>
                  </div>
                </div>
              )}

              {block.type === "image" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                      {block.imageId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/page-image/${block.imageId}`}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, block.id);
                      }}
                      className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-green-dark"
                    />
                  </div>
                  <input
                    value={block.caption}
                    onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                    placeholder="Caption (optional)"
                    className={`w-full ${fieldClass()}`}
                  />
                  <select
                    value={block.width}
                    onChange={(e) => updateBlock(block.id, { width: e.target.value as ImageWidth })}
                    className={fieldClass()}
                  >
                    {IMAGE_WIDTHS.map((w) => (
                      <option key={w} value={w}>
                        {w[0].toUpperCase() + w.slice(1)} width
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {block.type === "button" && (
                <div className="flex flex-wrap gap-2">
                  <input
                    value={block.label}
                    onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                    placeholder="Button text"
                    className={fieldClass()}
                  />
                  <input
                    value={block.href}
                    onChange={(e) => updateBlock(block.id, { href: e.target.value })}
                    placeholder="Link (e.g. /membership/register)"
                    className={fieldClass()}
                  />
                  <select
                    value={block.style}
                    onChange={(e) => updateBlock(block.id, { style: e.target.value as ButtonStyle })}
                    className={fieldClass()}
                  >
                    {BUTTON_STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {block.type === "spacer" && (
                <select
                  value={block.size}
                  onChange={(e) => updateBlock(block.id, { size: e.target.value as SpacerSize })}
                  className={fieldClass()}
                >
                  {SPACER_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s === "sm" ? "Small gap" : s === "md" ? "Medium gap" : "Large gap"}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-gray-300 p-4">
        <span className="text-sm text-gray-600">Add block:</span>
        {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            + {BLOCK_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Page"}
        </button>
        <button
          type="button"
          onClick={handleDeletePage}
          className="rounded-md border border-brand-red px-4 py-2 text-sm font-medium text-brand-red hover:bg-brand-red/5"
        >
          Delete Page
        </button>
        {savedAt && <span className="text-sm text-brand-green-dark">Saved.</span>}
        {error && <span className="text-sm text-brand-red">{error}</span>}
      </div>
    </div>
  );
}

function SizeSelect({ value, onChange }: { value: FontSize; onChange: (v: FontSize) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as FontSize)} className={fieldClass()}>
      {FONT_SIZES.map((s) => (
        <option key={s} value={s}>
          {FONT_SIZE_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

function ColorSelect({ value, onChange }: { value: TextColor; onChange: (v: TextColor) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as TextColor)} className={fieldClass()}>
      {TEXT_COLORS.map((c) => (
        <option key={c} value={c}>
          {TEXT_COLOR_LABELS[c]}
        </option>
      ))}
    </select>
  );
}

function AlignSelect({ value, onChange }: { value: Align; onChange: (v: Align) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as Align)} className={fieldClass()}>
      {ALIGNMENTS.map((a) => (
        <option key={a} value={a}>
          {a[0].toUpperCase() + a.slice(1)}
        </option>
      ))}
    </select>
  );
}
