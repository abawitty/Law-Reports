"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteImageKey } from "@/lib/site-images";

export function ImageUploadField({
  imageKey,
  label,
  currentUrl,
}: {
  imageKey: SiteImageKey;
  label: string;
  currentUrl?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const form = new FormData();
    form.set("file", file);
    const res = await fetch(`/api/admin/images/${imageKey}`, {
      method: "POST",
      body: form,
    });
    const result = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(result.error ?? "Upload failed");
      return;
    }
    router.refresh();
  }

  async function handleRemove() {
    setUploading(true);
    await fetch(`/api/admin/images/${imageKey}`, { method: "DELETE" });
    setUploading(false);
    setPreview(undefined);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-black/10 p-5">
      <h3 className="font-semibold text-gray-900">{label}</h3>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={label} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-green-dark"
          />
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="text-xs font-medium text-brand-red hover:underline disabled:opacity-60"
            >
              Remove image
            </button>
          )}
          {uploading && <p className="text-xs text-gray-500">Saving…</p>}
          {error && <p className="text-xs text-brand-red">{error}</p>}
        </div>
      </div>
    </div>
  );
}
