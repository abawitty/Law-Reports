"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GalleryDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this photo from the gallery?")) return;
    setLoading(true);
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md border border-brand-red/30 px-2 py-1 text-xs font-medium text-brand-red hover:bg-brand-red/5 disabled:opacity-60"
    >
      {loading ? "…" : "Remove"}
    </button>
  );
}
