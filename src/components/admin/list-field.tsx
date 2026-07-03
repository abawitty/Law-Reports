"use client";

export function ListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
}) {
  function update(i: number, next: string) {
    const copy = [...value];
    copy[i] = next;
    onChange(copy);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded-md border border-gray-300 px-2 text-xs text-gray-500 hover:bg-gray-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        + Add item
      </button>
    </div>
  );
}
