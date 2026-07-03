import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Member Login",
  description: "Log in to your TEIN-KUC & NDC member account.",
};

export default function LoginPage() {
  return (
    <div>
      <PageHero eyebrow="Membership" title="Member Login" />
      <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </div>
  );
}
