"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/ideology", label: "Ideology" },
  { href: "/membership", label: "Membership" },
  { href: "/resources", label: "Resources" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  session,
  logoImages,
}: {
  session: { fullName: string; role: string } | null;
  logoImages?: { teinKucLogoUrl?: string; ndcLogoUrl?: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo images={logoImages} />
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-green/10 text-brand-green-dark"
                    : "text-gray-700 hover:bg-gray-100 hover:text-brand-green-dark"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-2">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-semibold text-brand-green-dark hover:bg-gray-100"
              >
                {session.fullName.split(" ")[0]}&apos;s Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/membership/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Member Login
              </Link>
              <Link
                href="/membership/register"
                className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-black/10" />
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-brand-green-dark"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/membership/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Member Login
                </Link>
                <Link
                  href="/membership/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
