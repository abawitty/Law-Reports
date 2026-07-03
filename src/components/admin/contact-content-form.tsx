"use client";

import { useState } from "react";
import type { ContactContent } from "@/lib/content-defaults";
import { RowsField } from "@/components/admin/rows-field";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function ContactContentForm({ initial }: { initial: ContactContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("contact");

  function field<K extends keyof ContactContent>(key: K, value: ContactContent[K]) {
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

      <RowsField
        label="Leadership contacts"
        fields={[
          { key: "role", label: "Role" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
        ]}
        rows={data.leadershipContacts}
        onChange={(v) => field("leadershipContacts", v as ContactContent["leadershipContacts"])}
        emptyRow={{ role: "", email: "", phone: "" }}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">Leadership note</label>
        <input
          value={data.leadershipNote}
          onChange={(e) => field("leadershipNote", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Office address</label>
          <input
            value={data.officeAddress}
            onChange={(e) => field("officeAddress", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Office email</label>
          <input
            value={data.officeEmail}
            onChange={(e) => field("officeEmail", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Office hours</label>
          <input
            value={data.officeHours}
            onChange={(e) => field("officeHours", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Member note</label>
        <textarea
          value={data.memberNote}
          onChange={(e) => field("memberNote", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
