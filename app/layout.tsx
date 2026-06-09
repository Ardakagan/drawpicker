import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://drawpicker.io"),
  title: "DrawPicker - Professional Giveaway Platform",
  description: "Professional giveaway platform for X (Twitter) and YouTube.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-[#0a0a0f] text-white antialiased">{children}<Analytics /></body>
    </html>
  );
}
