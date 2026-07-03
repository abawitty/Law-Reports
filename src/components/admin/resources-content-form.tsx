"use client";

import { useState } from "react";
import type { ResourcesContent } from "@/lib/content-defaults";
import { RowsField } from "@/components/admin/rows-field";
import { ListField } from "@/components/admin/list-field";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function ResourcesContentForm({ initial }: { initial: ResourcesContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("resources");

  function field<K extends keyof ResourcesContent>(key: K, value: ResourcesContent[K]) {
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

      <h3 className="border-t border-black/10 pt-4 font-semibold text-brand-green-dark">
        Student Loan Trust Fund (SLTF)
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Intro</label>
        <textarea
          value={data.sltfIntro}
          onChange={(e) => field("sltfIntro", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <RowsField
        label="Steps"
        fields={[
          { key: "title", label: "Title" },
          { key: "body", label: "Description", multiline: true },
        ]}
        rows={data.sltfSteps}
        onChange={(v) => field("sltfSteps", v as ResourcesContent["sltfSteps"])}
        emptyRow={{ title: "", body: "" }}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">Help note</label>
        <textarea
          value={data.sltfNote}
          onChange={(e) => field("sltfNote", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <h3 className="border-t border-black/10 pt-4 font-semibold text-brand-green-dark">
        Ghana Card
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Intro</label>
        <textarea
          value={data.ghanaCardIntro}
          onChange={(e) => field("ghanaCardIntro", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <RowsField
        label="Cards"
        fields={[
          { key: "title", label: "Title" },
          { key: "body", label: "Description", multiline: true },
        ]}
        rows={data.ghanaCardCards}
        onChange={(v) => field("ghanaCardCards", v as ResourcesContent["ghanaCardCards"])}
        emptyRow={{ title: "", body: "" }}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          value={data.ghanaCardNote}
          onChange={(e) => field("ghanaCardNote", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <h3 className="border-t border-black/10 pt-4 font-semibold text-brand-green-dark">
        Academic Support
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Intro</label>
        <textarea
          value={data.academicIntro}
          onChange={(e) => field("academicIntro", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <ListField
        label="List items"
        value={data.academicItems}
        onChange={(v) => field("academicItems", v)}
      />

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
