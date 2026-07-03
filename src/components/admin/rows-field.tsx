"use client";

type FieldDef = { key: string; label: string; multiline?: boolean };

export function RowsField({
  label,
  fields,
  rows,
  onChange,
  emptyRow,
}: {
  label: string;
  fields: FieldDef[];
  rows: Record<string, string>[];
  onChange: (rows: Record<string, string>[]) => void;
  emptyRow: Record<string, string>;
}) {
  function update(i: number, key: string, value: string) {
    const copy = rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r));
    onChange(copy);
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {fields.map((f) =>
                f.multiline ? (
                  <textarea
                    key={f.key}
                    value={row[f.key] ?? ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.label}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green sm:col-span-2"
                  />
                ) : (
                  <input
                    key={f.key}
                    value={row[f.key] ?? ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.label}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                  />
                ),
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
            >
              Remove row
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, emptyRow])}
        className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        + Add row
      </button>
    </div>
  );
}
