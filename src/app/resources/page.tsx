import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Student Loan Trust Fund (SLTF) guides, Ghana Card information, and academic support for students.",
};

export default function ResourcesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Resources"
        title="Information &amp; Support"
        description="Practical guidance on student loans, the Ghana Card, and academic support — especially for students who don't yet have these in place."
      />

      <section id="sltf" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          Student Loan Trust Fund (SLTF)
        </h2>
        <p className="mt-3 text-gray-700">
          The Students Loan Trust Fund (SLTF) provides loans to eligible
          tertiary students in Ghana to help cover fees and living costs.
          Here&apos;s a general guide — always confirm current details on the
          official SLTF portal.
        </p>

        <ol className="mt-6 space-y-4">
          {[
            {
              title: "Check eligibility",
              body: "You must be a Ghanaian citizen, admitted to or enrolled in an accredited tertiary institution, and have a valid Ghana Card and SSNIT number.",
            },
            {
              title: "Gather documents",
              body: "Ghana Card, SSNIT number, admission or continuing-student letter, guarantor details, and passport photographs.",
            },
            {
              title: "Apply online",
              body: "Create an account on the SLTF portal, complete the application form, and upload the required documents before the deadline.",
            },
            {
              title: "Guarantor & obligor process",
              body: "Provide a qualifying guarantor (SSNIT contributor or approved alternative) to co-sign your loan obligation.",
            },
            {
              title: "Track disbursement",
              body: "Monitor your application status online; approved loans are disbursed directly to your institution and, where applicable, to you.",
            },
          ].map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-lg border border-black/10 bg-gray-50 p-4 text-sm text-gray-600">
          Need one-on-one help with your SLTF application? Log in to your
          member account and submit a request under{" "}
          <span className="font-medium text-brand-green-dark">
            My Dashboard → Requests
          </span>
          , and an executive will assist you.
        </div>
      </section>

      <section
        id="ghana-card"
        className="scroll-mt-24 border-t border-black/10 bg-gray-50 py-14"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-green-dark">Ghana Card</h2>
          <p className="mt-3 text-gray-700">
            The Ghana Card is the national ID required for the SLTF, SSNIT
            registration, and many other services. If you don&apos;t have one
            yet, here&apos;s how to get started.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Where to register</h3>
              <p className="mt-2 text-sm text-gray-600">
                Visit a National Identification Authority (NIA) registration
                centre, or watch for NIA registration exercises organised on
                or near campus — TEIN-KUC will announce these when scheduled.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-5">
              <h3 className="font-semibold text-gray-900">What to bring</h3>
              <p className="mt-2 text-sm text-gray-600">
                An existing form of ID (passport, voter&apos;s ID, or old
                NHIS card) if available, and two guarantors who already have
                Ghana Cards if you have no prior ID.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Registration steps</h3>
              <p className="mt-2 text-sm text-gray-600">
                Pre-register online where available, visit the centre for
                biometric capture (photo, fingerprints, signature), and keep
                your acknowledgement slip safe.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Tracking your card</h3>
              <p className="mt-2 text-sm text-gray-600">
                Use your acknowledgement/tracking number on the NIA
                self-service platform to check production and collection
                status.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-black/10 bg-white p-4 text-sm text-gray-600">
            Students without a Ghana Card can log in and submit a request for
            TEIN-KUC to help coordinate a group registration or point you to
            the nearest active centre.
          </div>
        </div>
      </section>

      <section id="academic" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          Academic Support
        </h2>
        <p className="mt-3 text-gray-700">
          TEIN-KUC connects members with academic resources and peer support
          throughout the semester.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li className="flex gap-2">
            <span aria-hidden className="text-brand-green">✓</span>
            Peer study groups and tutorial sessions organised by course reps.
          </li>
          <li className="flex gap-2">
            <span aria-hidden className="text-brand-green">✓</span>
            Guidance on registration, add/drop periods, and exam procedures.
          </li>
          <li className="flex gap-2">
            <span aria-hidden className="text-brand-green">✓</span>
            Referrals to the college&apos;s counselling and academic affairs office.
          </li>
          <li className="flex gap-2">
            <span aria-hidden className="text-brand-green">✓</span>
            A channel to raise academic concerns through your member dashboard.
          </li>
        </ul>
      </section>
    </div>
  );
}
