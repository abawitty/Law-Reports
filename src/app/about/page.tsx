import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The history of TEIN-KUC, our executive team, and the President's profile.",
};

const EXECUTIVES = [
  { role: "President", name: "Addo Benjamin Armah" },
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
            institutions. The TEIN-KUC chapter serves students of Kings
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
            AA
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Addo Benjamin Armah — President
            </h3>
            <div className="mt-2 space-y-3 text-sm text-gray-600">
              <p>
                Addo Benjamin Armah leads TEIN-KUC &amp; NDC as President,
                bringing a background in law, student governance, and
                organisational leadership to the role. He holds a Bachelor of
                Laws (LLB) from Kings University College and is currently
                pursuing a Master of Laws (LLM) in International Law,
                Security &amp; Diplomacy at the University of Gold Coast.
              </p>
              <p>
                Within Kings University College&apos;s own student
                government, he currently serves as Legal Affairs Commissioner
                &amp; Chief Legal Counsel to the SRC — chairing the Legal
                Affairs Commission, representing the Executive, Parliamentary,
                and Judicial Councils at judicial hearings, and providing
                legal defence services to students before the Disciplinary
                Board. He previously served as Vice President of the Law
                Students&apos; Union, where he spearheaded the LSU website
                and the Dr. Attakora Legal Tree to widen student access to
                legal resources, and coached the LSU delegation to the Sarah
                F. Kpodo International Moot Court Competition.
              </p>
              <p>
                His leadership extends beyond campus: he is President of the
                University Student Chamber Ghana and Chairman of the
                University Student Chamber&apos;s West African Committee,
                representing Ghanaian students in national and international
                forums and coordinating the annual West African Student
                Leadership Summit. He also serves as Company Secretary &amp;
                Administrator for several organisations, and as President of
                the Adom Community League, a community development and
                advocacy group in the Greater Accra Region.
              </p>
              <p>
                Addo brings this record of legal advocacy, constitutional
                governance, and community organising to TEIN-KUC &amp; NDC —
                with a particular focus on strengthening students&apos;
                access to information, due process, and a transparent voice
                in decisions that affect them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
