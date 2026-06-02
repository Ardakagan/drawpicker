"use client";

import { useState } from "react";
import LangPicker from "./LangPicker";
import Rule from "./Rule";
import ResultsPanel from "./ResultsPanel";
import { tr } from "@/lib/i18n";
import type { Platform, Rules, User } from "@/lib/types";

const ACCENT: Record<string, any> = {
  sky: {
    text: "text-sky-400",
    ring: "focus:border-sky-500",
    btn: "from-sky-500 via-blue-600 to-purple-600",
    solid: "bg-blue-600 hover:bg-blue-500",
    hover: "hover:border-sky-500",
    ruleOn: "border-sky-500 bg-sky-500/10",
    chk: "bg-sky-500",
    check: "text-sky-400",
    cardFrom: "from-sky-500/15 to-purple-500/10 border border-sky-500/40",
    certBorder: "border-sky-500/40",
  },
  purple: {
    text: "text-purple-400",
    ring: "focus:border-purple-500",
    btn: "from-purple-500 via-fuchsia-600 to-pink-600",
    solid: "bg-purple-600 hover:bg-purple-500",
    hover: "hover:border-purple-500",
    ruleOn: "border-purple-500 bg-purple-500/10",
    chk: "bg-purple-500",
    check: "text-purple-400",
    cardFrom: "from-purple-500/15 to-pink-500/10 border border-purple-500/40",
    certBorder: "border-purple-500/40",
  },
};

export type RuleDef = { key: keyof Rules; fixed?: boolean; default?: boolean };

export type GiveawayConfig = {
  platform: Platform;
  accent: "sky" | "purple";
  icon: string;
  titleKey: string;
  subKey: string;
  inputKey: string;
  inputPhKey: string;
  ruleDefs: RuleDef[];
  showKeyword?: boolean;
  showMinLen?: boolean;
  showMinFollowers?: boolean;
};

const QUICK = ["mustLike", "mustFollow", "mustRetweet", "mustComment", "aiSafe", "uniqueComments"];

export default function GiveawayPage({ config }: { config: GiveawayConfig }) {
  const a = ACCENT[config.accent];
  const [lang, setLang] = useState("en");
  const t = tr(lang);

  const [input, setInput] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [backupCount, setBackupCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [minLen, setMinLen] = useState(0);
  const [minFollowers, setMinFollowers] = useState(0);

  const initialRules: Record<string, boolean> = {};
  config.ruleDefs.forEach((r) => (initialRules[r.key as string] = Boolean(r.default || r.fixed)));

  const [rules, setRules] = useState<Record<string, boolean>>(initialRules);
  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState<User[]>([]);
  const [backups, setBackups] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [certCode, setCertCode] = useState("DP-7X8K9L2M1N");
  const [error, setError] = useState("");

  const quickRules = config.ruleDefs.filter((r) => QUICK.includes(r.key as string));
  const generalRules = config.ruleDefs.filter((r) => !QUICK.includes(r.key as string));

  function toggle(key: string) {
    const fixed = config.ruleDefs.find((r) => r.key === key)?.fixed;
    if (fixed) return;
    setRules((p) => ({ ...p, [key]: !p[key] }));
  }

  function hash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return "DP-" + Math.abs(h).toString(36).toUpperCase().padEnd(10, "0").slice(0, 10);
  }

  async function startDraw() {
    setError("");
    setWinners([]);
    setBackups([]);
    setTotal(0);

    if (!input.trim()) {
      setError(t("noUrl"));
      return;
    }

    setLoading(true);

    try {
      const reqRules: Rules = { ...rules, keyword, minLen, minFollowers };

      config.ruleDefs.forEach((r) => {
        if (r.fixed) (reqRules as any)[r.key] = true;
      });

      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: config.platform,
          input,
          winnerCount,
          backupCount,
          rules: reqRules,
          excluded: [],
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok || data.error) throw new Error(data.error || `API error: ${res.status}`);
      if (!data.mainWinners || data.mainWinners.length === 0) throw new Error(t("noElig"));

      const code = hash(input + Date.now() + data.mainWinners.map((w: User) => w.username).join());

      setTotal(data.totalParticipants || 0);
      setWinners(data.mainWinners);
      setBackups(data.backupWinners || []);
      setCertCode(code);

      localStorage.setItem(
        "drawpicker:lastDraw",
        JSON.stringify({
          platform: config.platform,
          total: data.totalParticipants || 0,
          winners: data.mainWinners,
          createdAt: new Date().toISOString(),
        })
      );
    } catch (e: any) {
      setError(e?.message || t("apiErr"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050814] text-white px-4 py-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,#0ea5e955,transparent_28%),radial-gradient(circle_at_right,#8b5cf655,transparent_30%),radial-gradient(circle_at_top,#111827,transparent_45%)]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="relative max-w-7xl mx-auto border border-white/10 rounded-[28px] bg-black/25 backdrop-blur-xl px-6 sm:px-10 py-7 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="flex items-center gap-3 font-black">
            <span className="text-3xl bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">DP</span>
            <span>DrawPicker</span>
          </a>
          <LangPicker lang={lang} setLang={setLang} accentHover={a.hover} accentCheck={a.check} />
        </div>

        <a href="/" className="inline-block text-zinc-400 hover:text-white mb-4">← Home</a>

        <div className="text-center mb-8">
          <div className="text-7xl font-black mb-2">{config.platform === "twitter" ? "𝕏" : config.icon}</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
              {config.platform === "twitter" ? "X Giveaway" : t(config.titleKey)}
            </span>
          </h1>
          <p className="text-zinc-300 text-sm">{t(config.subKey)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.85fr] gap-6">
          <section className="bg-[#0b0f1a]/80 border border-white/10 rounded-3xl p-6">
            <div className="font-black mb-3">🔗 {config.platform === "twitter" ? "Tweet URL or ID" : t(config.inputKey)}</div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t(config.inputPhKey)}
              className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 outline-none text-sm ${a.ring} mb-6`}
            />

            <div className="font-black mb-3">⚡ Quick Rules</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {quickRules.map((r) => (
                <Rule
                  key={r.key as string}
                  label={t("r_" + (r.key as string))}
                  val={r.fixed ? true : Boolean(rules[r.key as string])}
                  toggle={() => toggle(r.key as string)}
                  fixed={r.fixed}
                  onClass={a.ruleOn}
                  chkClass={a.chk}
                />
              ))}
            </div>

            <details className="border-t border-white/10 border-b py-4 mb-5">
              <summary className="cursor-pointer font-black">📋 General Rules</summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {generalRules.map((r) => (
                  <Rule
                    key={r.key as string}
                    label={t("r_" + (r.key as string))}
                    val={r.fixed ? true : Boolean(rules[r.key as string])}
                    toggle={() => toggle(r.key as string)}
                    fixed={r.fixed}
                    onClass={a.ruleOn}
                    chkClass={a.chk}
                  />
                ))}
              </div>

              {config.showKeyword && rules["mustKeyword"] && (
                <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t("kwPh")} className={`mt-4 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none ${a.ring}`} />
              )}

              {config.showMinLen && rules["mustMinLength"] && (
                <input type="number" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} placeholder="5" className={`mt-4 w-40 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none ${a.ring}`} />
              )}

              {config.showMinFollowers && rules["mustMinFollowers"] && (
                <input type="number" value={minFollowers} onChange={(e) => setMinFollowers(Number(e.target.value))} placeholder="100" className={`mt-4 w-40 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none ${a.ring}`} />
              )}
            </details>

            <div className="font-black mb-3">⚙️ Draw Settings</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                <label className="text-xs text-zinc-400">{t("winnerCount")}</label>
                <input type="number" min={1} value={winnerCount} onChange={(e) => setWinnerCount(Number(e.target.value))} className="w-full bg-transparent outline-none text-lg mt-2" />
              </div>
              <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                <label className="text-xs text-zinc-400">{t("backupCount")}</label>
                <input type="number" min={0} value={backupCount} onChange={(e) => setBackupCount(Number(e.target.value))} className="w-full bg-transparent outline-none text-lg mt-2" />
              </div>
            </div>

            <button onClick={startDraw} disabled={loading} className={`w-full bg-gradient-to-r ${a.btn} py-4 rounded-xl font-black shadow-lg disabled:opacity-50`}>
              {loading ? `⏳ ${t("loading")}...` : `🎯 ${t("draw")}`}
            </button>

            {error && <p className="text-red-400 text-sm mt-3">❌ {error}</p>}
          </section>

          <ResultsPanel
            t={t}
            accent={a}
            total={total}
            winners={winners}
            backups={backups}
            certCode={certCode}
            onRedraw={startDraw}
            compactEmpty
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-white/10 pt-6 text-sm">
          <div>🛡️ <b>100% Fair</b><br /><span className="text-zinc-500">Random & unbiased</span></div>
          <div>🔒 <b>Privacy First</b><br /><span className="text-zinc-500">We don't store data</span></div>
          <div>⚡ <b>Fast & Secure</b><br /><span className="text-zinc-500">Results in seconds</span></div>
          <div>📜 <b>Certified</b><br /><span className="text-zinc-500">Verifiable certificate</span></div>
        </div>
      </div>
    </main>
  );
}