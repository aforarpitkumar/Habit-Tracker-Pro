import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker Pro",
  description: "Track your habits with beautiful grid visualizations",
  manifest: "/manifest.json",
  keywords: ["habit tracker", "productivity", "habits", "self-improvement"],
  authors: [
    {
      name: "Habit Tracker Pro",
    },
  ],
  creator: "Habit Tracker Pro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://habittracker.pro",
    title: "Habit Tracker Pro",
    description: "Track your habits with beautiful grid visualizations",
    siteName: "Habit Tracker Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Habit Tracker Pro",
    description: "Track your habits with beautiful grid visualizations",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    shortcut: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
