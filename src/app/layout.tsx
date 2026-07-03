import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthSessionProvider } from "@/components/session-provider";
import { getSiteImageMeta, siteImageUrl } from "@/lib/site-images";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TEIN-KUC & NDC",
    template: "%s | TEIN-KUC & NDC",
  },
  description:
    "Official portal of TEIN-KUC & NDC: membership, elections, student loan and Ghana Card guidance for students of Kings University College.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, teinKucLogo, ndcLogo] = await Promise.all([
    auth(),
    getSiteImageMeta("tein-kuc-logo"),
    getSiteImageMeta("ndc-logo"),
  ]);

  const logoImages = {
    teinKucLogoUrl: teinKucLogo.exists
      ? siteImageUrl("tein-kuc-logo", teinKucLogo.version)
      : undefined,
    ndcLogoUrl: ndcLogo.exists ? siteImageUrl("ndc-logo", ndcLogo.version) : undefined,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>
          <SiteHeader
            session={
              session?.user
                ? { fullName: session.user.fullName, role: session.user.role }
                : null
            }
            logoImages={logoImages}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter logoImages={logoImages} />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
