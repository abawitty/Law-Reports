"use client";

import { useState } from "react";
import type { HomeContent } from "@/lib/content-defaults";
import { ListField } from "@/components/admin/list-field";
import { RowsField } from "@/components/admin/rows-field";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function HomeContentForm({ initial }: { initial: HomeContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("home");

  function field<K extends keyof HomeContent>(key: K, value: HomeContent[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Hero eyebrow</label>
        <input
          value={data.heroEyebrow}
          onChange={(e) => field("heroEyebrow", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hero title</label>
        <input
          value={data.heroTitle}
          onChange={(e) => field("heroTitle", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hero description</label>
        <textarea
          value={data.heroDescription}
          onChange={(e) => field("heroDescription", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hero panel title</label>
        <input
          value={data.heroPanelTitle}
          onChange={(e) => field("heroPanelTitle", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <ListField
        label="Hero panel bullet points"
        value={data.heroPanelItems}
        onChange={(v) => field("heroPanelItems", v)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          &quot;What You Can Do Here&quot; heading
        </label>
        <input
          value={data.sectionHeading}
          onChange={(e) => field("sectionHeading", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Section description</label>
        <textarea
          value={data.sectionDescription}
          onChange={(e) => field("sectionDescription", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <RowsField
        label="Highlight cards"
        fields={[
          { key: "title", label: "Title" },
          { key: "body", label: "Description", multiline: true },
        ]}
        rows={data.highlights}
        onChange={(v) => field("highlights", v as HomeContent["highlights"])}
        emptyRow={{ title: "", body: "" }}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose title</label>
          <input
            value={data.purposeTitle}
            onChange={(e) => field("purposeTitle", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Voice title</label>
          <input
            value={data.voiceTitle}
            onChange={(e) => field("voiceTitle", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Get Involved title</label>
          <input
            value={data.involvedTitle}
            onChange={(e) => field("involvedTitle", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <textarea
          value={data.purposeBody}
          onChange={(e) => field("purposeBody", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <textarea
          value={data.voiceBody}
          onChange={(e) => field("voiceBody", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <textarea
          value={data.involvedBody}
          onChange={(e) => field("involvedBody", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
