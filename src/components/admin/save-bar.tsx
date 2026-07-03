"use client";

export function SaveBar({
  saving,
  saved,
  error,
  onSave,
}: {
  saving: boolean;
  saved: boolean;
  error: string | null;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-0 mt-6 flex items-center gap-3 border-t border-black/10 bg-white/95 py-4 backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
      {saved && <span className="text-sm text-brand-green-dark">Saved.</span>}
      {error && <span className="text-sm text-brand-red">{error}</span>}
    </div>
  );
}
