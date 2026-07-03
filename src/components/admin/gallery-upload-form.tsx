"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function GalleryUploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image first");
      return;
    }

    setError(null);
    setUploading(true);

    const form = new FormData();
    form.set("file", file);
    form.set("caption", captionRef.current?.value ?? "");

    const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 rounded-xl border border-black/10 p-5">
      {error && <p className="text-sm text-brand-red">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-green-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Caption (optional)</label>
        <input
          ref={captionRef}
          placeholder="e.g. Freshers' orientation, September 2026"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "Add Photo"}
      </button>
    </form>
  );
}
