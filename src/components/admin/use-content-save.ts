"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PageSlug } from "@/lib/content-defaults";

export function useContentSave(page: PageSlug) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(data: unknown) {
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await fetch(`/api/admin/content/${page}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(result.error ?? "Could not save changes");
      return false;
    }
    setSaved(true);
    router.refresh();
    return true;
  }

  return { save, saving, error, saved };
}
