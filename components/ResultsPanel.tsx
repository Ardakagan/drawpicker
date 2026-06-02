"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

type Accent = {
  text: string;
  solid: string;
  hover: string;
  cardFrom: string;
  certBorder: string;
};

function avatarOf(w: any) {
  return w.avatar || w.profileImage || w.profile_image_url || w.profilePicture || w.image || "";
}

export default function ResultsPanel({
  t,
  accent,
  total,
  winners,
  backups,
  certCode,
  onRedraw,
  compactEmpty = false,
}: {
  t: (k: string) => string;
  accent: Accent;
  total: number;
  winners: User[];
  backups: User[];
  certCode: string;
  onRedraw: () => void;
  compactEmpty?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  function exportCSV() {
    const rows = [["No", "Username", "Name", "Followers", "Type"]];
    winners.forEach((w: any, i) => rows.push([String(i + 1), "@" + w.username, w.author || w.name || "", String(w.followers || 0), "WINNER"]));
    backups.forEach((w: any, i) => rows.push(["B" + (i + 1), "@" + w.username, w.author || w.name || "", String(w.followers || 0), "BACKUP"]));
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    a.download = "drawpicker.csv";
    a.click();
  }

  async function shareResult() {
    const names = winners.map((w) => "@" + w.username).join(", ");
    const text = `🎉 ${t("winner")}: ${names}\n${t("cert")}: ${certCode}`;
    const url = "https://drawpicker.io";

    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: "DrawPicker", text, url });
        return;
      } catch (e: any) {
        if (e?.name === "AbortError") return;
      }
    }

    const win = window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + "\n" + url)}`, "_blank", "noopener,noreferrer");
    if (!win) {
      await navigator.clipboard.writeText(text + "\n" + url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (compactEmpty && winners.length === 0) {
    return (
      <section className="bg-[#0b0f1a]/80 border border-white/10 rounded-3xl p-6">
        <div className="font-black mb-4">🏆 Results</div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-10 text-center text-zinc-400 mb-6">
          <div className="text-4xl mb-3">🎉</div>
          Your results will appear here after the draw.
        </div>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-5">
          <div className="font-black mb-3">🛡️ Draw Certificate</div>
          <div className={`text-center font-mono text-cyan-400 bg-black/30 border border-dashed ${accent.certBorder} rounded-xl py-5 tracking-widest`}>
            {certCode}
            <div className="text-xs text-zinc-400 font-sans mt-2 tracking-normal">
              This certificate proves the fairness and transparency of the draw.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0b0f1a]/80 border border-white/10 rounded-3xl p-6">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-cyan-400">{total.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 mt-1">{t("total")}</div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-cyan-400">{winners.length}</div>
          <div className="text-xs text-zinc-500 mt-1">{t("winnersStat")}</div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-cyan-400">{backups.length}</div>
          <div className="text-xs text-zinc-500 mt-1">{t("backups")}</div>
        </div>
      </div>

      <div className={`bg-gradient-to-br ${accent.cardFrom} rounded-3xl p-6 mb-4 relative overflow-hidden`}>
        <div className="absolute top-3 left-4 text-3xl">🎊</div>
        <div className="absolute top-4 right-5 text-3xl">🎉</div>
        <div className={`text-xs ${accent.text} uppercase tracking-widest mb-5 text-center font-black`}>
          {t("winner")}
        </div>

        <div className="space-y-3">
          {winners.map((w: any, i) => (
            <div key={i} className="bg-black/20 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-2xl">
                {avatarOf(w) ? <img src={avatarOf(w)} alt={w.username} className="w-full h-full object-cover" /> : "👤"}
              </div>
              <div>
                <div className="text-xl font-black">@{w.username}</div>
                <div className="text-zinc-400 text-sm">{w.author || w.name || ""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {backups.length > 0 && (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="font-black mb-3">🥈 {t("backups")}</div>
          {backups.map((w: any, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <span className="text-zinc-500 font-black">B{i + 1}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">{avatarOf(w) && <img src={avatarOf(w)} className="w-full h-full object-cover" />}</div>
              <span>@{w.username}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-5 mb-4">
        <div className="font-black mb-3">🛡️ {t("cert")}</div>
        <div className={`text-center font-mono text-cyan-400 bg-black/30 border border-dashed ${accent.certBorder} rounded-xl py-4 tracking-widest`}>
          {certCode}
        </div>
      </div>

      {copied && <p className="text-green-400 text-sm mb-3 text-center">✅ {t("copied")}</p>}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button onClick={onRedraw} className={`border border-white/10 ${accent.hover} py-3 rounded-xl font-bold text-sm transition`}>
          {t("redraw")}
        </button>
        <button onClick={shareResult} className={`${accent.solid} py-3 rounded-xl font-bold text-sm transition`}>
          {t("share")}
        </button>
      </div>

      <button onClick={exportCSV} className={`w-full border border-white/10 ${accent.hover} py-3 rounded-xl font-bold text-sm transition`}>
        {t("export")}
      </button>
    </section>
  );
}