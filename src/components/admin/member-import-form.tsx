"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ImportResult = {
  row: number;
  studentId: string;
  fullName: string;
  email: string;
  status: "created" | "skipped";
  reason?: string;
  initialPassword?: string;
};

const TEMPLATE_HEADER =
  "studentId,surname,firstName,email,phone,whatsapp,program,level,faculty,occupation,constituency,sex,dateOfBirth,hasVotersId,hasGhanaCard";
const TEMPLATE_EXAMPLE =
  "20230001,Mensah,Ama,ama.mensah@example.com,0244000111,0244000111,BSc Computer Science,200,Faculty of Science,Student,Ablekuma North,Female,2000-05-15,Yes,No";

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function resultsToCsv(results: ImportResult[]): string {
  const header = "row,studentId,fullName,email,status,initialPassword,reason";
  const rows = results.map((r) =>
    [
      r.row,
      r.studentId,
      r.fullName,
      r.email,
      r.status,
      r.initialPassword ?? "",
      r.reason ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}

export function MemberImportForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [counts, setCounts] = useState<{ created: number; skipped: number } | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a CSV file first");
      return;
    }

    setError(null);
    setUploading(true);
    setResults(null);

    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/members/import", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Import failed");
      return;
    }

    setResults(data.results);
    setCounts({ created: data.createdCount, skipped: data.skippedCount });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 p-5">
        <h3 className="font-semibold text-gray-900">1. Download the CSV template</h3>
        <p className="mt-1 text-sm text-gray-600">
          Fill in one row per member. Only <strong>studentId</strong>, <strong>surname</strong>,{" "}
          <strong>firstName</strong>, and <strong>email</strong> are required — leave other
          columns blank if unknown.
        </p>
        <button
          type="button"
          onClick={() =>
            downloadBlob(
              "teinkuc-members-template.csv",
              `${TEMPLATE_HEADER}\n${TEMPLATE_EXAMPLE}\n`,
              "text/csv",
            )
          }
          className="mt-3 rounded-md border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
        >
          Download CSV Template
        </button>
      </div>

      <form
        onSubmit={handleUpload}
        className="space-y-4 rounded-xl border border-black/10 p-5"
      >
        <h3 className="font-semibold text-gray-900">2. Upload your completed CSV</h3>
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-green-dark"
        />
        <button
          type="submit"
          disabled={uploading}
          className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {uploading ? "Importing…" : "Import Members"}
        </button>
      </form>

      {results && counts && (
        <div className="rounded-xl border border-black/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">
              3. Results — {counts.created} created, {counts.skipped} skipped
            </h3>
            {counts.created > 0 && (
              <button
                type="button"
                onClick={() => downloadBlob("teinkuc-import-results.csv", resultsToCsv(results), "text/csv")}
                className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:brightness-90"
              >
                Download Initial Passwords (CSV)
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Each newly created member has a temporary password. Share it with them securely
            (this is the only time it&apos;s shown) — they&apos;ll be required to set their own
            password the first time they log in.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-black/10 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Row", "Student ID", "Name", "Email", "Status", "Initial Password / Reason"].map(
                    (h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 bg-white">
                {results.map((r) => (
                  <tr key={r.row}>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{r.row}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{r.studentId}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-900">{r.fullName}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{r.email}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          r.status === "created"
                            ? "bg-brand-green/10 text-brand-green-dark"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-900">
                      {r.initialPassword ?? r.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
