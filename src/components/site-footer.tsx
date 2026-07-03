import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-brand-green-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Logo variant="dark" />
          <p className="mt-3 text-sm text-white/70">
            Tertiary Education Institutions Network — Koforidua University College,
            in partnership with the NDC. Serving students with information,
            representation, and support.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/ideology" className="hover:text-white">Ideology</Link></li>
            <li><Link href="/membership" className="hover:text-white">Membership</Link></li>
            <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Resources
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/resources#sltf" className="hover:text-white">Student Loans (SLTF)</Link></li>
            <li><Link href="/resources#ghana-card" className="hover:text-white">Ghana Card</Link></li>
            <li><Link href="/resources#academic" className="hover:text-white">Academic Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Koforidua University College, Koforidua</li>
            <li><a href="mailto:info@teinkuc.org" className="hover:text-white">info@teinkuc.org</a></li>
            <li><Link href="/contact" className="hover:text-white">Contact leadership →</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6">
        © {new Date().getFullYear()} TEIN-KUC &amp; NDC. All rights reserved.
      </div>
    </footer>
  );
}
