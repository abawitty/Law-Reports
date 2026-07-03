"use client";

import { useState } from "react";
import type { AboutContent } from "@/lib/content-defaults";
import { RowsField } from "@/components/admin/rows-field";
import { ParagraphsField } from "@/components/admin/paragraphs-field";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function AboutContentForm({ initial }: { initial: AboutContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("about");

  function field<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Page hero title</label>
        <input
          value={data.heroTitle}
          onChange={(e) => field("heroTitle", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Page hero description</label>
        <textarea
          value={data.heroDescription}
          onChange={(e) => field("heroDescription", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <ParagraphsField
        label="History of TEIN-KUC"
        value={data.historyParagraphs}
        onChange={(v) => field("historyParagraphs", v)}
        rows={8}
      />

      <RowsField
        label="Executive team"
        fields={[
          { key: "role", label: "Role (e.g. President)" },
          { key: "name", label: "Name" },
        ]}
        rows={data.executives}
        onChange={(v) => field("executives", v as AboutContent["executives"])}
        emptyRow={{ role: "", name: "" }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">President&apos;s name</label>
        <input
          value={data.presidentName}
          onChange={(e) => field("presidentName", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <p className="mt-1 text-xs text-gray-500">
          To change the President&apos;s photo, use the Images tab.
        </p>
      </div>

      <ParagraphsField
        label="President's bio"
        value={data.presidentBioParagraphs}
        onChange={(v) => field("presidentBioParagraphs", v)}
        rows={10}
      />

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
