import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import { AuthProvider } from "@/components/Auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AktieKoll",
  description: "Insyns transaktioner på aktiemarknaden i Sverige",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    {/* lang changed from "en" to "sv" — the app content is Swedish (affects screen readers, SEO) */}
    <html lang="sv" className={inter.variable}>
      <body className="font-sans bg-bg text-ink">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
