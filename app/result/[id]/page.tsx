"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { tr } from "@/lib/i18n";

type Winner = {
  username?: string;
  author?: string;
  profilePicture?: string;
};

const R: Record<string, Record<string, string>> = {
  tr: { back: "← Ana Sayfaya Dön", title: "Çekiliş Sonucu", drawInfo: "Çekiliş Bilgisi", platform: "Platform", date: "Tarih", rulesTitle: "Uygulanan Kurallar", viewPost: "Gönderiyi Gör", sParticipants: "Katılımcı", sWinners: "Kazanan", sBackups: "Yedek", cert: "Çekiliş Sertifikası", share: "Çekilişi Paylaş", copied: "Link Kopyalandı!", newDraw: "Yeni Çekiliş Başlat", winnersTitle: "Kazananlar", backupsTitle: "Yedek Kazananlar", notFound: "Sonuç Bulunamadı", loading: "Yükleniyor...", tagline: "Sosyal medyada adil & şeffaf çekilişler" },
  en: { back: "← Back to Home", title: "Giveaway Result", drawInfo: "Giveaway Info", platform: "Platform", date: "Date", rulesTitle: "Applied Rules", viewPost: "View Post", sParticipants: "Participants", sWinners: "Winners", sBackups: "Backups", cert: "Draw Certificate", share: "Share Result", copied: "Link Copied!", newDraw: "New Giveaway", winnersTitle: "Winners", backupsTitle: "Backup Winners", notFound: "Result Not Found", loading: "Loading...", tagline: "Fair & transparent social media giveaways" },
  de: { back: "← Zur Startseite", title: "Gewinnspiel-Ergebnis", drawInfo: "Gewinnspiel-Info", platform: "Plattform", date: "Datum", rulesTitle: "Angewandte Regeln", viewPost: "Beitrag ansehen", sParticipants: "Teilnehmer", sWinners: "Gewinner", sBackups: "Ersatz", cert: "Verlosungszertifikat", share: "Ergebnis teilen", copied: "Link kopiert!", newDraw: "Neues Gewinnspiel", winnersTitle: "Gewinner", backupsTitle: "Ersatzgewinner", notFound: "Ergebnis nicht gefunden", loading: "Lädt...", tagline: "Faire & transparente Social-Media-Gewinnspiele" },
  zh: { back: "← 返回首页", title: "抽奖结果", drawInfo: "抽奖信息", platform: "平台", date: "日期", rulesTitle: "适用规则", viewPost: "查看帖子", sParticipants: "参与者", sWinners: "获奖者", sBackups: "替补", cert: "抽奖证书", share: "分享结果", copied: "链接已复制！", newDraw: "新建抽奖", winnersTitle: "获奖名单", backupsTitle: "替补获奖者", notFound: "未找到结果", loading: "加载中...", tagline: "公平透明的社交媒体抽奖" },
  ru: { back: "← На главную", title: "Результат розыгрыша", drawInfo: "О розыгрыше", platform: "Платформа", date: "Дата", rulesTitle: "Применённые правила", viewPost: "Открыть пост", sParticipants: "Участники", sWinners: "Победители", sBackups: "Запасные", cert: "Сертификат розыгрыша", share: "Поделиться", copied: "Ссылка скопирована!", newDraw: "Новый розыгрыш", winnersTitle: "Победители", backupsTitle: "Запасные победители", notFound: "Результат не найден", loading: "Загрузка...", tagline: "Честные и прозрачные розыгрыши в соцсетях" },
  ko: { back: "← 홈으로", title: "추첨 결과", drawInfo: "추첨 정보", platform: "플랫폼", date: "날짜", rulesTitle: "적용된 규칙", viewPost: "게시물 보기", sParticipants: "참여자", sWinners: "당첨자", sBackups: "예비", cert: "추첨 인증서", share: "결과 공유", copied: "링크 복사됨!", newDraw: "새 추첨", winnersTitle: "당첨자", backupsTitle: "예비 당첨자", notFound: "결과를 찾을 수 없음", loading: "로딩 중...", tagline: "공정하고 투명한 소셜 미디어 추첨" },
  es: { back: "← Volver al inicio", title: "Resultado del sorteo", drawInfo: "Información del sorteo", platform: "Plataforma", date: "Fecha", rulesTitle: "Reglas aplicadas", viewPost: "Ver publicación", sParticipants: "Participantes", sWinners: "Ganadores", sBackups: "Suplentes", cert: "Certificado del sorteo", share: "Compartir resultado", copied: "¡Enlace copiado!", newDraw: "Nuevo sorteo", winnersTitle: "Ganadores", backupsTitle: "Ganadores suplentes", notFound: "Resultado no encontrado", loading: "Cargando...", tagline: "Sorteos justos y transparentes en redes sociales" },
  it: { back: "← Torna alla home", title: "Risultato del sorteo", drawInfo: "Info sorteo", platform: "Piattaforma", date: "Data", rulesTitle: "Regole applicate", viewPost: "Vedi post", sParticipants: "Partecipanti", sWinners: "Vincitori", sBackups: "Riserve", cert: "Certificato sorteggio", share: "Condividi risultato", copied: "Link copiato!", newDraw: "Nuovo sorteggio", winnersTitle: "Vincitori", backupsTitle: "Vincitori di riserva", notFound: "Risultato non trovato", loading: "Caricamento...", tagline: "Sorteggi equi e trasparenti sui social" },
  fr: { back: "← Retour à l'accueil", title: "Résultat du tirage", drawInfo: "Infos du tirage", platform: "Plateforme", date: "Date", rulesTitle: "Règles appliquées", viewPost: "Voir la publication", sParticipants: "Participants", sWinners: "Gagnants", sBackups: "Suppléants", cert: "Certificat du tirage", share: "Partager le résultat", copied: "Lien copié !", newDraw: "Nouveau tirage", winnersTitle: "Gagnants", backupsTitle: "Gagnants suppléants", notFound: "Résultat introuvable", loading: "Chargement...", tagline: "Tirages équitables et transparents sur les réseaux" },
  el: { back: "← Στην αρχική", title: "Αποτέλεσμα κλήρωσης", drawInfo: "Πληροφορίες κλήρωσης", platform: "Πλατφόρμα", date: "Ημερομηνία", rulesTitle: "Εφαρμοσμένοι κανόνες", viewPost: "Προβολή ανάρτησης", sParticipants: "Συμμετέχοντες", sWinners: "Νικητές", sBackups: "Αναπληρωματικοί", cert: "Πιστοποιητικό κλήρωσης", share: "Κοινοποίηση", copied: "Ο σύνδεσμος αντιγράφηκε!", newDraw: "Νέα κλήρωση", winnersTitle: "Νικητές", backupsTitle: "Αναπληρωματικοί νικητές", notFound: "Δεν βρέθηκε αποτέλεσμα", loading: "Φόρτωση...", tagline: "Δίκαιες & διαφανείς κληρώσεις στα social media" },
  pl: { back: "← Strona główna", title: "Wynik losowania", drawInfo: "Informacje o losowaniu", platform: "Platforma", date: "Data", rulesTitle: "Zastosowane zasady", viewPost: "Zobacz post", sParticipants: "Uczestnicy", sWinners: "Zwycięzcy", sBackups: "Rezerwowi", cert: "Certyfikat losowania", share: "Udostępnij wynik", copied: "Link skopiowany!", newDraw: "Nowe losowanie", winnersTitle: "Zwycięzcy", backupsTitle: "Zwycięzcy rezerwowi", notFound: "Nie znaleziono wyniku", loading: "Ładowanie...", tagline: "Uczciwe i przejrzyste losowania w mediach społecznościowych" },
  ro: { back: "← Înapoi acasă", title: "Rezultatul extragerii", drawInfo: "Informații extragere", platform: "Platformă", date: "Dată", rulesTitle: "Reguli aplicate", viewPost: "Vezi postarea", sParticipants: "Participanți", sWinners: "Câștigători", sBackups: "Rezerve", cert: "Certificat tragere", share: "Distribuie rezultatul", copied: "Link copiat!", newDraw: "Extragere nouă", winnersTitle: "Câștigători", backupsTitle: "Câștigători de rezervă", notFound: "Rezultat negăsit", loading: "Se încarcă...", tagline: "Extrageri corecte și transparente pe rețelele sociale" },
};

const LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN", ru: "ru-RU", ko: "ko-KR",
  es: "es-ES", it: "it-IT", fr: "fr-FR", el: "el-GR", pl: "pl-PL", ro: "ro-RO",
};

const LANG_OPTIONS: { code: string; label: string }[] = [
  { code: "tr", label: "🇹🇷 TR" }, { code: "en", label: "🇬🇧 EN" }, { code: "de", label: "🇩🇪 DE" },
  { code: "zh", label: "🇨🇳 ZH" }, { code: "ru", label: "🇷🇺 RU" }, { code: "ko", label: "🇰🇷 KO" },
  { code: "es", label: "🇪🇸 ES" }, { code: "it", label: "🇮🇹 IT" }, { code: "fr", label: "🇫🇷 FR" },
  { code: "el", label: "🇬🇷 EL" }, { code: "pl", label: "🇵🇱 PL" }, { code: "ro", label: "🇷🇴 RO" },
];

const RULE_KEYS = [
  "mustLike", "mustRetweet", "mustComment", "mustFollow", "mustMention",
  "mustKeyword", "mustMinLength", "mustProfile", "mustMinFollowers",
  "mustExtraFollow", "mustAccountAge", "blockHidden", "aiSafe",
  "advancedBotFilter", "uniqueComments",
];

const RULE_VALUE_FIELD: Record<string, string> = {
  mustMention: "mentionUsername",
  mustKeyword: "keyword",
  mustExtraFollow: "extraFollowAccount",
  mustMinFollowers: "minFollowers",
  mustMinLength: "minLength",
  mustAccountAge: "accountAgeDays",
};

export default function ResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState("en");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rt = R[lang] || R.en;
  const t = tr(lang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dp_lang") || localStorage.getItem("drawpicker_lang");
      if (saved && R[saved]) { setLang(saved); return; }
    } catch {}
    const nav = (typeof navigator !== "undefined" ? navigator.language : "")?.slice(0, 2);
    if (nav && R[nav]) setLang(nav);
  }, []);

  function changeLang(code: string) {
    setLang(code);
    try { localStorage.setItem("dp_lang", code); } catch {}
  }

  useEffect(() => {
    if (!id) return;
    fetch(`/api/result/${id}`)
      .then((r) => r.json())
      .then((data) => { setResult(data.result || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: any[] = [];
    const colors = ["#60a5fa", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#f87171", "#e879f9"];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      pieces.forEach((p) => {
        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle);
        ctx!.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx!.restore();
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas!.height) {
          p.y = -10;
          p.x = Math.random() * canvas!.width;
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [result]);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `DrawPicker — ${rt.title}`, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed,#be185d)" }}>
        <div className="text-white text-lg sm:text-xl font-black animate-pulse">⏳ {rt.loading}</div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed,#be185d)" }}>
        <div className="text-center text-white">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{rt.notFound}</h1>
          <a href="/" className="text-white/70 hover:text-white text-sm underline">{rt.back}</a>
        </div>
      </main>
    );
  }

  const winners: Winner[] = result.winners || [];
  const backups: Winner[] = result.backups || [];
  const isTwitter = result.platform === "twitter";
  const date = result.created_at
    ? new Date(result.created_at).toLocaleDateString(LOCALE_MAP[lang] || "en-US")
    : "";

  const postUrl: string =
    result.source_url || result.tweet_url || result.input || result.url || "";
  const hasPostUrl = typeof postUrl === "string" && postUrl.startsWith("http");

  const rulesObj = result.rules || {};
  const activeRules = RULE_KEYS.filter((k) => rulesObj[k]);

  const giveawayPath = isTwitter ? "/twitter" : "/youtube";

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed,#be185d)" }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      <div className="fixed -top-20 -left-20 w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-50 pointer-events-none" style={{ background: "#60a5fa" }} />
      <div className="fixed -bottom-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-50 pointer-events-none" style={{ background: "#f472b6" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: "#a78bfa" }} />

      <div className="relative z-20 max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8 min-h-screen flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <a href="/" className="text-white/80 hover:text-white text-xs sm:text-sm transition px-3 py-2 rounded-xl whitespace-nowrap" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
            {rt.back}
          </a>
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="text-xs sm:text-sm text-white rounded-xl px-2 py-2 outline-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            {LANG_OPTIONS.map((o) => (
              <option key={o.code} value={o.code} style={{ color: "#111" }}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="text-center mb-5 sm:mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-white font-black text-xl sm:text-2xl hover:opacity-90 transition">
            <span className="text-2xl sm:text-3xl">🎁</span>
            <span>DrawPicker<span className="text-white/70">.io</span></span>
          </a>
          <p className="text-white/70 text-xs sm:text-sm mt-1">{rt.tagline}</p>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-3 sm:mt-4">🎉 {rt.title}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 flex-1">
          <div className="rounded-3xl p-4 sm:p-6 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <div className="text-white font-black text-base sm:text-lg flex items-center gap-2">
              <span>📋</span><span>{rt.drawInfo}</span>
            </div>

            <div>
              <div className="text-white/60 text-[11px] uppercase tracking-widest mb-1">{rt.platform}</div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{isTwitter ? "𝕏" : "▶️"}</span>
                <span className="text-white font-black text-base sm:text-lg">{isTwitter ? "Twitter / X" : "YouTube"}</span>
              </div>
            </div>

            {hasPostUrl && (
              <a href={postUrl} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white text-sm underline underline-offset-4 break-all transition">
                🔗 {rt.viewPost}
              </a>
            )}

            {date && (
              <div>
                <div className="text-white/60 text-[11px] uppercase tracking-widest mb-1">{rt.date}</div>
                <div className="text-white font-bold">{date}</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="text-white font-black text-xl sm:text-2xl">{result.total?.toLocaleString() || "—"}</div>
                <div className="text-white/60 text-[10px] sm:text-xs mt-1">{rt.sParticipants}</div>
              </div>
              <div className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="text-white font-black text-xl sm:text-2xl">{winners.length}</div>
                <div className="text-white/60 text-[10px] sm:text-xs mt-1">{rt.sWinners}</div>
              </div>
              <div className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="text-white font-black text-xl sm:text-2xl">{backups.length}</div>
                <div className="text-white/60 text-[10px] sm:text-xs mt-1">{rt.sBackups}</div>
              </div>
            </div>

            {activeRules.length > 0 && (
              <div>
                <div className="text-white/60 text-[11px] uppercase tracking-widest mb-2">{rt.rulesTitle}</div>
                <div className="flex flex-wrap gap-2">
                  {activeRules.map((k) => {
                    const valField = RULE_VALUE_FIELD[k];
                    const val = valField ? rulesObj[valField] : "";
                    return (
                      <span key={k} className="text-white text-xs font-medium rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>
                        ✓ {t("r_" + k)}{val ? `: ${val}` : ""}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.1)", border: "1px dashed rgba(255,255,255,0.3)" }}>
              <div className="text-white/60 text-[11px] mb-1">📜 {rt.cert}</div>
              <div className="text-white font-black text-lg sm:text-xl tracking-widest break-all">{result.cert_code}</div>
            </div>

            <button onClick={handleShare} className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base transition hover:opacity-90 active:scale-95" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}>
              {copied ? `✅ ${rt.copied}` : `🔗 ${rt.share}`}
            </button>

            <a href={giveawayPath} className="w-full py-3.5 rounded-2xl font-black text-sm text-center transition hover:opacity-90 active:scale-95" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}>
              {t("redraw")}
            </a>

            <a href={giveawayPath} className="w-full py-3 rounded-2xl font-bold text-sm text-center transition hover:opacity-90" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>
              🎯 {rt.newDraw}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-4 sm:p-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <div className="text-white font-black text-lg sm:text-xl mb-4">🏆 {rt.winnersTitle}</div>
              <div className="space-y-3">
                {winners.map((w, i) => (
                  <div key={i} className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    {w.profilePicture ? (
                      <img src={w.profilePicture} alt={w.username} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid rgba(255,255,255,0.4)" }} />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-lg sm:text-xl" style={{ background: `linear-gradient(135deg,hsl(${i * 80 + 200},70%,60%),hsl(${i * 80 + 240},70%,50%))` }}>
                        {(w.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-black text-base sm:text-lg truncate">@{w.username}</div>
                      {w.author && <div className="text-white/60 text-xs sm:text-sm truncate">{w.author}</div>}
                    </div>
                    <div className="text-xl sm:text-2xl flex-shrink-0">🏆</div>
                  </div>
                ))}
              </div>
            </div>

            {backups.length > 0 && (
              <div className="rounded-3xl p-4 sm:p-6" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="text-white/80 font-black text-base sm:text-lg mb-4">🥈 {rt.backupsTitle}</div>
                <div className="space-y-2">
                  {backups.map((w, i) => (
                    <div key={i} className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      {w.profilePicture ? (
                        <img src={w.profilePicture} alt={w.username} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black" style={{ background: "rgba(255,255,255,0.2)" }}>
                          {(w.username || "?")[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-white font-bold truncate">@{w.username}</div>
                        {w.author && <div className="text-white/50 text-xs truncate">{w.author}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a href="/" className="text-white/50 hover:text-white/80 text-xs transition">
            🎁 DrawPicker.io — {rt.tagline}
          </a>
        </div>
      </div>
    </main>
  );
}
