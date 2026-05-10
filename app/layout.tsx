import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Spend Audit — Stop Overpaying for AI Tools",
    template: "%s | AI Spend Audit",
  },
  description:
    "Instantly audit your team's AI tool subscriptions. Find overspending, better plans, and alternative tools. Free, no signup required.",
  keywords: [
    "AI tools audit",
    "ChatGPT pricing",
    "Claude pricing",
    "GitHub Copilot cost",
    "AI subscription savings",
    "SaaS spend optimization",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aispendaudit.com",
    title: "AI Spend Audit — Stop Overpaying for AI Tools",
    description:
      "Audit your AI subscriptions in 2 minutes. See exactly where you're overspending.",
    siteName: "AI Spend Audit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Spend Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit — Stop Overpaying for AI Tools",
    description: "Audit your AI subscriptions in 2 minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
