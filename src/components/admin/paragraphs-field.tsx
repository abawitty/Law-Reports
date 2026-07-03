"use client";

export function ParagraphsField({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string;
  value: string[];
  onChange: (paragraphs: string[]) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1 text-xs text-gray-500">Separate paragraphs with a blank line.</p>
      <textarea
        value={value.join("\n\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          )
        }
        rows={rows}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
      />
    </div>
  );
}
