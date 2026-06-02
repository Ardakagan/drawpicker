import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrawPicker — Sosyal Medya Çekiliş Aracı",
  description: "Twitter (X) ve YouTube çekilişlerinden adil kazanan seçin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}
