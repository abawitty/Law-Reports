"use client";

import { useState } from "react";
import type { MembershipContent } from "@/lib/content-defaults";
import { RowsField } from "@/components/admin/rows-field";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function MembershipContentForm({ initial }: { initial: MembershipContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("membership");

  function field<K extends keyof MembershipContent>(key: K, value: MembershipContent[K]) {
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Member card title</label>
          <input
            value={data.newMemberTitle}
            onChange={(e) => field("newMemberTitle", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
          <textarea
            value={data.newMemberBody}
            onChange={(e) => field("newMemberBody", e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Existing Member card title
          </label>
          <input
            value={data.existingMemberTitle}
            onChange={(e) => field("existingMemberTitle", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
          <textarea
            value={data.existingMemberBody}
            onChange={(e) => field("existingMemberBody", e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <RowsField
        label="Feature cards"
        fields={[
          { key: "title", label: "Title" },
          { key: "body", label: "Description", multiline: true },
        ]}
        rows={data.features}
        onChange={(v) => field("features", v as MembershipContent["features"])}
        emptyRow={{ title: "", body: "" }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Membership types intro</label>
        <textarea
          value={data.typesIntro}
          onChange={(e) => field("typesIntro", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <RowsField
        label="Membership types (from the Constitution)"
        fields={[
          { key: "title", label: "Type name" },
          { key: "body", label: "Description", multiline: true },
        ]}
        rows={data.membershipTypes}
        onChange={(v) => field("membershipTypes", v as MembershipContent["membershipTypes"])}
        emptyRow={{ title: "", body: "" }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Constitution intro</label>
        <textarea
          value={data.constitutionIntro}
          onChange={(e) => field("constitutionIntro", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <p className="mt-1 text-xs text-gray-500">
          The PDF download button below this text always links to
          /documents/teinkuc-constitution.pdf.
        </p>
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
