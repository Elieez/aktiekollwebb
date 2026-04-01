import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/Auth";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aktiekoll.se";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AktieKoll – Spåra insiderhandel på Stockholmsbörsen",
    template: "%s – AktieKoll",
  },
  description:
    "Följ insidertransaktioner i realtid. Se vad bolagsledare och styrelsemedlemmar köper och säljer i sina egna bolag – direkt från Finansinspektionen.",
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: SITE_URL,
    siteName: "AktieKoll",
    title: "AktieKoll – Spåra insiderhandel på Stockholmsbörsen",
    description:
      "Följ insidertransaktioner i realtid. Se vad bolagsledare köper och säljer – direkt från Finansinspektionen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AktieKoll – Spåra insiderhandel på Stockholmsbörsen",
    description:
      "Följ insidertransaktioner i realtid. Se vad bolagsledare köper och säljer – direkt från Finansinspektionen.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme: light)').matches))document.documentElement.classList.add('light');}catch(e){}})()` }} />
      </head>
      <body className="font-sans bg-bg text-ink flex flex-col min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
