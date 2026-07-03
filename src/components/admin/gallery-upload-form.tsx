"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type StagedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export function GalleryUploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newItems: StagedPhoto[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
      status: "pending",
    }));
    setStaged((prev) => [...prev, ...newItems]);
    e.target.value = "";
  }

  function updateCaption(id: string, caption: string) {
    setStaged((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  }

  function removeStaged(id: string) {
    setStaged((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleUploadAll() {
    setUploading(true);
    const items = staged.filter((p) => p.status !== "done");

    for (const item of items) {
      setStaged((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: "uploading" } : p)),
      );

      const form = new FormData();
      form.set("file", item.file);
      form.set("caption", item.caption);

      const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));

      setStaged((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? res.ok
              ? { ...p, status: "done" }
              : { ...p, status: "error", error: data.error ?? "Upload failed" }
            : p,
        ),
      );
    }

    setUploading(false);
    setStaged((prev) => prev.filter((p) => p.status !== "done"));
    router.refresh();
  }

  const pendingCount = staged.filter((p) => p.status !== "done").length;

  return (
    <div className="space-y-4 rounded-xl border border-black/10 p-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Photos (select multiple to bulk upload)
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleSelectFiles}
          className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-green-dark"
        />
        <p className="mt-1 text-xs text-gray-500">PNG, JPEG, or WebP, up to 4MB each.</p>
      </div>

      {staged.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {staged.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-black/10">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                  {item.status !== "done" && (
                    <button
                      type="button"
                      onClick={() => removeStaged(item.id)}
                      disabled={item.status === "uploading"}
                      aria-label="Remove"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80 disabled:opacity-50"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 p-2">
                  <input
                    value={item.caption}
                    onChange={(e) => updateCaption(item.id, e.target.value)}
                    placeholder="Caption (optional)"
                    disabled={item.status === "uploading" || item.status === "done"}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green disabled:bg-gray-50"
                  />
                  {item.status === "uploading" && (
                    <p className="text-xs text-gray-500">Uploading…</p>
                  )}
                  {item.status === "done" && (
                    <p className="text-xs text-brand-green-dark">Uploaded</p>
                  )}
                  {item.status === "error" && (
                    <p className="text-xs text-brand-red">{item.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUploadAll}
            disabled={uploading || pendingCount === 0}
            className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
          >
            {uploading
              ? "Uploading…"
              : `Upload ${pendingCount} Photo${pendingCount === 1 ? "" : "s"}`}
          </button>
        </>
      )}
    </div>
  );
}
