import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your TEIN-KUC & NDC member account.",
};

export default function RegisterPage() {
  return (
    <div>
      <PageHero eyebrow="Membership" title="Create Your Member Account" />
      <section className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <RegisterForm />
      </section>
    </div>
  );
}
