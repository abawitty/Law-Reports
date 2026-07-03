"use client";

import { useState } from "react";
import type { IdeologyContent } from "@/lib/content-defaults";
import { RowsField } from "@/components/admin/rows-field";
import { ParagraphsField } from "@/components/admin/paragraphs-field";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function IdeologyContentForm({ initial }: { initial: IdeologyContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("ideology");

  function field<K extends keyof IdeologyContent>(key: K, value: IdeologyContent[K]) {
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
        label="NDC History"
        value={data.historyParagraphs}
        onChange={(v) => field("historyParagraphs", v)}
        rows={8}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Governance philosophy intro</label>
        <textarea
          value={data.philosophyIntro}
          onChange={(e) => field("philosophyIntro", e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <RowsField
        label="Philosophy cards"
        fields={[
          { key: "title", label: "Title" },
          { key: "body", label: "Description", multiline: true },
        ]}
        rows={data.philosophyCards}
        onChange={(v) => field("philosophyCards", v as IdeologyContent["philosophyCards"])}
        emptyRow={{ title: "", body: "" }}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            National leader name
          </label>
          <input
            value={data.nationalLeaderName}
            onChange={(e) => field("nationalLeaderName", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            National leader title
          </label>
          <input
            value={data.nationalLeaderTitle}
            onChange={(e) => field("nationalLeaderTitle", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>
      <p className="-mt-4 text-xs text-gray-500">
        The photo itself is uploaded from Site Content → Images &amp; Logos → National Leadership
        Photo.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700">Manifesto text</label>
        <textarea
          value={data.manifestoText}
          onChange={(e) => field("manifestoText", e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <p className="mt-1 text-xs text-gray-500">
          The &quot;Visit ndc.org.gh&quot; and &quot;Contact&quot; links below this text are fixed and always shown.
        </p>
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
