import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The history of TEIN-KUC, our executive team, and the President's profile.",
};

const EXECUTIVES = [
  { role: "President", name: "To Be Announced" },
  { role: "Vice President", name: "To Be Announced" },
  { role: "General Secretary", name: "To Be Announced" },
  { role: "Financial Secretary", name: "To Be Announced" },
  { role: "Organiser", name: "To Be Announced" },
  { role: "Women's Commissioner", name: "To Be Announced" },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About Us"
        title="Who We Are"
        description="The history of TEIN-KUC, our current executive team, and the President's profile."
      />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          History of TEIN-KUC
        </h2>
        <div className="mt-4 space-y-4 text-gray-700">
          <p>
            The Tertiary Education Institutions Network (TEIN) is the student
            wing of the National Democratic Congress (NDC), established to
            organise and represent students within Ghana&apos;s tertiary
            institutions. The TEIN-KUC chapter serves students of Koforidua
            University College, championing student welfare, access to
            education, and civic participation.
          </p>
          <p>
            Since its founding on campus, TEIN-KUC has worked to bridge the
            gap between students and the resources they need — from
            information on the Students Loan Trust Fund (SLTF) to support for
            students without a Ghana Card — while fostering leadership and
            democratic values among members.
          </p>
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            This page will be updated with the full chapter history,
            founding milestones, and past achievements. Executive members can
            propose edits through the Contact page.
          </p>
        </div>
      </section>

      <section className="border-t border-black/10 bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-green-dark">
            The Executive Team
          </h2>
          <p className="mt-2 text-gray-600">
            The current executives elected to lead TEIN-KUC &amp; NDC.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXECUTIVES.map((exec) => (
              <div
                key={exec.role}
                className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-lg font-bold text-brand-green-dark">
                  {exec.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{exec.name}</h3>
                <p className="text-sm text-brand-red">{exec.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          President&apos;s Profile
        </h2>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-2xl font-bold text-brand-green-dark">
            TK
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">President — To Be Announced</h3>
            <p className="mt-2 text-sm text-gray-600">
              The President&apos;s biography, academic background, and vision
              for TEIN-KUC &amp; NDC will be published here once submitted by
              the executive office.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
