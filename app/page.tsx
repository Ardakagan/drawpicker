"use client";

import { useEffect, useState } from "react";
import LangPicker from "@/components/LangPicker";
import { tr } from "@/lib/i18n";

type LastDraw = {
  platform: "twitter" | "youtube";
  total: number;
  winners: { username: string; author?: string }[];
  createdAt: string;
};

export default function Home() {
  const [lang, setLang] = useState("en");
  const [lastDraw, setLastDraw] = useState<LastDraw | null>(null);
  const t = tr(lang);

  useEffect(() => {
    const raw = localStorage.getItem("drawpicker:lastDraw");
    if (raw) setLastDraw(JSON.parse(raw));
  }, []);

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_35%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_35%)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="flex justify-end mb-10">
          <LangPicker lang={lang} setLang={setLang} accentHover="hover:border-sky-500" accentCheck="text-sky-400" />
        </div>

        <section className="text-center mb-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              DrawPicker
            </span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            {t("l_sub")}
          </p>
        </section>

        {lastDraw && (
          <a
            href={`/${lastDraw.platform}`}
            className="block mb-8 bg-[#16161f]/90 border border-white/10 rounded-3xl p-5 hover:border-cyan-400 transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                  Last Draw
                </div>
                <div className="font-black text-xl">
                  {lastDraw.platform === "twitter" ? "𝕏 Twitter / X" : "▶️ YouTube"}
                </div>
                <div className="text-zinc-400 text-sm mt-1">
                  Total Participants: {lastDraw.total.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500 mb-1">Winner</div>
                <div className="text-cyan-300 font-black">
                  @{lastDraw.winners?.[0]?.username || "winner"}
                </div>
              </div>
            </div>
          </a>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <a href="/twitter" className="group bg-[#16161f]/90 border border-white/10 hover:border-sky-500 rounded-3xl p-8 transition">
            <div className="text-5xl mb-5">𝕏</div>
            <div className="text-2xl font-black text-sky-400 mb-2">{t("tw_title")}</div>
            <div className="text-zinc-400 text-sm">{t("l_twSub")}</div>
          </a>

          <a href="/youtube" className="group bg-[#16161f]/90 border border-white/10 hover:border-purple-500 rounded-3xl p-8 transition">
            <div className="text-5xl mb-5">▶️</div>
            <div className="text-2xl font-black text-purple-400 mb-2">{t("yt_title")}</div>
            <div className="text-zinc-400 text-sm">{t("l_ytSub")}</div>
          </a>
        </div>
      </div>
    </main>
  );
}