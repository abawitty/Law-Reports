"use client";

import { useState } from "react";
import type { EmailContent } from "@/lib/content-defaults";
import { SaveBar } from "@/components/admin/save-bar";
import { useContentSave } from "@/components/admin/use-content-save";

export function EmailContentForm({ initial }: { initial: EmailContent }) {
  const [data, setData] = useState(initial);
  const { save, saving, error, saved } = useContentSave("emails");

  function field<K extends keyof EmailContent>(key: K, value: EmailContent[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-brand-green/20 bg-brand-green/5 p-3 text-xs text-brand-green-dark">
        The greeting, membership number, login details table, and login link are fixed and always
        filled in correctly for each member — only the subject line and the message text below
        can be edited.
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Approval Email</h3>
        <p className="text-xs text-gray-500">Sent when an admin approves a member&apos;s application.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            value={data.approvalSubject}
            onChange={(e) => field("approvalSubject", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message (shown before the membership number)
          </label>
          <textarea
            value={data.approvalIntro}
            onChange={(e) => field("approvalIntro", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Closing line (shown after the login link)
          </label>
          <textarea
            value={data.approvalClosing}
            onChange={(e) => field("approvalClosing", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-black/10 pt-6">
        <h3 className="font-semibold text-gray-900">Account Created / Password Reset Email</h3>
        <p className="text-xs text-gray-500">
          Sent when a member is created via CSV import, or when an admin resets a member&apos;s
          password — in both cases it includes a temporary password.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            value={data.welcomeSubject}
            onChange={(e) => field("welcomeSubject", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message (shown before the login details table)
          </label>
          <textarea
            value={data.welcomeIntro}
            onChange={(e) => field("welcomeIntro", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Closing line (shown after the login link)
          </label>
          <textarea
            value={data.welcomeClosing}
            onChange={(e) => field("welcomeClosing", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
