import Link from "next/link";

const HIGHLIGHTS = [
  {
    title: "Student Loan (SLTF) Guidance",
    description:
      "Step-by-step help applying for the Students Loan Trust Fund, from eligibility to disbursement.",
    href: "/resources#sltf",
  },
  {
    title: "Ghana Card Support",
    description:
      "Guidance for students without a Ghana Card — where to register, what to bring, and how to track your application.",
    href: "/resources#ghana-card",
  },
  {
    title: "Online Elections",
    description:
      "Registered members vote securely for executive positions during scheduled online elections.",
    href: "/membership",
  },
  {
    title: "Queries & Suggestions",
    description:
      "Logged-in members can submit requests, questions, or suggestions directly to the executives.",
    href: "/membership",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Welcome to
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              TEIN-KUC &amp; NDC
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              The official portal of the Tertiary Education Institutions Network
              at Kings University College, in partnership with the NDC —
              connecting students to student loans, Ghana Card support,
              membership services, and a transparent voice in decision-making.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/membership/register"
                className="rounded-md bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-green-dark shadow-sm hover:brightness-95"
              >
                Become a Member
              </Link>
              <Link
                href="/resources"
                className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Resources
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-brand-gold">
              Latest Highlights
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li className="flex gap-2">
                <span aria-hidden>•</span>
                <span>SLTF application window guidance now available in Resources.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>•</span>
                <span>Members can now register and log in to the member portal.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>•</span>
                <span>Online elections are conducted securely through member accounts.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          What You Can Do Here
        </h2>
        <p className="mt-2 max-w-2xl text-gray-600">
          This portal exists to keep every TEIN-KUC member informed and
          involved — from accessing student loans to having a real say in
          how the association is run.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-xl border border-black/10 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold text-brand-green-dark group-hover:underline">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold text-brand-green-dark">Our Purpose</h3>
              <p className="mt-2 text-sm text-gray-600">
                To keep members informed, represented, and supported — with
                clear information on student loans and the Ghana Card, and a
                transparent system for decisions like online elections.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-green-dark">Your Voice</h3>
              <p className="mt-2 text-sm text-gray-600">
                Members can log in anytime to view their data, vote in
                elections, and submit requests, queries, or suggestions to
                the executive team.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-green-dark">Get Involved</h3>
              <p className="mt-2 text-sm text-gray-600">
                Register for membership today to unlock the member dashboard
                and participate fully in TEIN-KUC &amp; NDC activities.
              </p>
              <Link
                href="/membership/register"
                className="mt-3 inline-block text-sm font-semibold text-brand-green hover:underline"
              >
                Register now →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
