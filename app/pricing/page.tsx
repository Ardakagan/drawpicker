"use client";

import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase-client";
import LangPicker from "@/components/LangPicker";

const PT: Record<string, any> = {
  tr: {
    back: "← Ana Sayfa", title: "Fiyatlandırma", sub: "İhtiyacına göre plan ve ödeme şekli seç.",
    monthly: "Aylık", yearly: "Yıllık", discount: "%30 indirim", freeDesc: "Tek seferlik deneme",
    current: "Mevcut Plan", default: "Varsayılan", popular: "EN POPÜLER", perMonth: "ay", perYear: "yıl",
    yearlySave: "tasarruf", loading: "Yükleniyor...",
    subBtn: "🔁 Abonelik (oto-yenilenir)", onceBtn: "💎 Tek Seferlik Al", onceNote: "Kripto ile ödenebilir · yenilenmez",
    secure: "Güvenli ödeme · Dodo Payments",
    features: {
      free: ["1 ücretsiz çekiliş", "200 katılımcıya kadar", "Tweet beğeni kontrolü", "Retweet kontrolü", "Sonuç sertifikası"],
      starter: ["Sınırsız çekiliş", "5.000 katılımcıya kadar", "Beğeni ve retweet kontrolü", "Yorum ve takip kontrolü", "Etiketleme ve anahtar kelime", "Yedek kazanan", "CSV export", "Sonuç sertifikası"],
      pro: ["Sınırsız çekiliş", "40.000 katılımcıya kadar", "Starter özellikleri", "Ek X hesabı takibi", "Profil fotoğrafı kontrolü", "Minimum takipçi", "Minimum yorum uzunluğu", "Bot / spam filtresi", "Öncelikli tarama"],
      business: ["Sınırsız çekiliş", "300.000 katılımcıya kadar", "Pro özellikleri", "Hesap yaşı kontrolü", "Gizli hesap filtreleme", "Gelişmiş bot analizi", "Çoklu kullanıcı", "API erişimi", "White Label", "Özel destek"],
    },
  },
  en: {
    back: "← Home", title: "Pricing", sub: "Choose the plan and payment type that fits you.",
    monthly: "Monthly", yearly: "Yearly", discount: "30% off", freeDesc: "One-time trial",
    current: "Current Plan", default: "Default", popular: "MOST POPULAR", perMonth: "month", perYear: "year",
    yearlySave: "saved", loading: "Loading...",
    subBtn: "🔁 Subscription (auto-renew)", onceBtn: "💎 One-time Purchase", onceNote: "Crypto supported · no renewal",
    secure: "Secure payment · Dodo Payments",
    features: {
      free: ["1 free giveaway", "Up to 200 participants", "Tweet like check", "Retweet check", "Result certificate"],
      starter: ["Unlimited giveaways", "Up to 5,000 participants", "Like and retweet check", "Comment and follow check", "Mention and keyword rules", "Backup winners", "CSV export", "Result certificate"],
      pro: ["Unlimited giveaways", "Up to 40,000 participants", "Starter features", "Extra X account follow", "Profile picture check", "Minimum followers", "Minimum comment length", "Bot / spam filter", "Priority scanning"],
      business: ["Unlimited giveaways", "Up to 300,000 participants", "Pro features", "Account age check", "Private account filtering", "Advanced bot analysis", "Multiple users", "API access", "White Label", "Priority support"],
    },
  },
  de: {
    back: "← Startseite", title: "Preise", sub: "Wähle Tarif und Zahlungsart, die zu dir passen.",
    monthly: "Monatlich", yearly: "Jährlich", discount: "30% Rabatt", freeDesc: "Einmaliger Test",
    current: "Aktueller Plan", default: "Standard", popular: "BELIEBT", perMonth: "Monat", perYear: "Jahr",
    yearlySave: "gespart", loading: "Lädt...",
    subBtn: "🔁 Abo (autom. Verlängerung)", onceBtn: "💎 Einmalkauf", onceNote: "Krypto möglich · keine Verlängerung",
    secure: "Sichere Zahlung · Dodo Payments",
    features: {
      free: ["1 kostenloses Gewinnspiel", "Bis zu 200 Teilnehmer", "Like-Prüfung", "Retweet-Prüfung", "Ergebniszertifikat"],
      starter: ["Unbegrenzte Gewinnspiele", "Bis zu 5.000 Teilnehmer", "Like- und Retweet-Prüfung", "Kommentar- und Follow-Prüfung", "Markierung und Keyword", "Ersatzgewinner", "CSV Export", "Ergebniszertifikat"],
      pro: ["Unbegrenzte Gewinnspiele", "Bis zu 40.000 Teilnehmer", "Starter-Funktionen", "Zusätzliches X-Konto folgen", "Profilbild-Prüfung", "Mindestanzahl Follower", "Min. Kommentarlänge", "Bot-/Spam-Filter", "Priorisierte Prüfung"],
      business: ["Unbegrenzte Gewinnspiele", "Bis zu 300.000 Teilnehmer", "Pro-Funktionen", "Account-Alter-Prüfung", "Private Konten filtern", "Erweiterte Bot-Analyse", "Mehrere Benutzer", "API-Zugriff", "White Label", "Premium-Support"],
    },
  },
  es: {
    back: "← Inicio", title: "Precios", sub: "Elige el plan y la forma de pago que necesitas.",
    monthly: "Mensual", yearly: "Anual", discount: "30% descuento", freeDesc: "Prueba única",
    current: "Plan actual", default: "Predeterminado", popular: "MÁS POPULAR", perMonth: "mes", perYear: "año",
    yearlySave: "ahorro", loading: "Cargando...",
    subBtn: "🔁 Suscripción (auto-renovable)", onceBtn: "💎 Compra única", onceNote: "Cripto disponible · sin renovación",
    secure: "Pago seguro · Dodo Payments",
    features: {
      free: ["1 sorteo gratis", "Hasta 200 participantes", "Comprobación de like", "Comprobación de retweet", "Certificado de resultado"],
      starter: ["Sorteos ilimitados", "Hasta 5.000 participantes", "Like y retweet", "Comentario y seguimiento", "Mención y palabra clave", "Ganadores suplentes", "Exportar CSV", "Certificado de resultado"],
      pro: ["Sorteos ilimitados", "Hasta 40.000 participantes", "Funciones Starter", "Seguimiento de cuenta X extra", "Comprobación de foto de perfil", "Mínimo de seguidores", "Longitud mínima de comentario", "Filtro bot/spam", "Escaneo prioritario"],
      business: ["Sorteos ilimitados", "Hasta 300.000 participantes", "Funciones Pro", "Edad de cuenta", "Filtro de cuentas privadas", "Análisis avanzado de bots", "Múltiples usuarios", "Acceso API", "White Label", "Soporte prioritario"],
    },
  },
  fr: {
    back: "← Accueil", title: "Tarifs", sub: "Choisissez le forfait et le mode de paiement adaptés.",
    monthly: "Mensuel", yearly: "Annuel", discount: "30% réduction", freeDesc: "Essai unique",
    current: "Plan actuel", default: "Par défaut", popular: "LE PLUS POPULAIRE", perMonth: "mois", perYear: "an",
    yearlySave: "économisé", loading: "Chargement...",
    subBtn: "🔁 Abonnement (renouv. auto)", onceBtn: "💎 Achat unique", onceNote: "Crypto possible · sans renouvellement",
    secure: "Paiement sécurisé · Dodo Payments",
    features: {
      free: ["1 tirage gratuit", "Jusqu’à 200 participants", "Vérification du like", "Vérification du retweet", "Certificat de résultat"],
      starter: ["Tirages illimités", "Jusqu’à 5.000 participants", "Like et retweet", "Commentaire et suivi", "Mention et mot-clé", "Gagnants suppléants", "Export CSV", "Certificat de résultat"],
      pro: ["Tirages illimités", "Jusqu’à 40.000 participants", "Fonctions Starter", "Suivi d’un compte X supplémentaire", "Vérification photo de profil", "Minimum d’abonnés", "Longueur minimale du commentaire", "Filtre bot/spam", "Scan prioritaire"],
      business: ["Tirages illimités", "Jusqu’à 300.000 participants", "Fonctions Pro", "Âge du compte", "Filtrage comptes privés", "Analyse bot avancée", "Utilisateurs multiples", "Accès API", "White Label", "Support prioritaire"],
    },
  },
  it: {
    back: "← Home", title: "Prezzi", sub: "Scegli il piano e il metodo di pagamento adatti.",
    monthly: "Mensile", yearly: "Annuale", discount: "30% sconto", freeDesc: "Prova singola",
    current: "Piano attuale", default: "Predefinito", popular: "PIÙ POPOLARE", perMonth: "mese", perYear: "anno",
    yearlySave: "risparmio", loading: "Caricamento...",
    subBtn: "🔁 Abbonamento (rinnovo auto)", onceBtn: "💎 Acquisto singolo", onceNote: "Cripto supportato · nessun rinnovo",
    secure: "Pagamento sicuro · Dodo Payments",
    features: {
      free: ["1 estrazione gratuita", "Fino a 200 partecipanti", "Controllo like", "Controllo retweet", "Certificato risultato"],
      starter: ["Estrazioni illimitate", "Fino a 5.000 partecipanti", "Like e retweet", "Commento e follow", "Menzione e parola chiave", "Vincitori di riserva", "Export CSV", "Certificato risultato"],
      pro: ["Estrazioni illimitate", "Fino a 40.000 partecipanti", "Funzioni Starter", "Follow account X extra", "Controllo foto profilo", "Follower minimi", "Lunghezza minima commento", "Filtro bot/spam", "Scansione prioritaria"],
      business: ["Estrazioni illimitate", "Fino a 300.000 partecipanti", "Funzioni Pro", "Età account", "Filtro account privati", "Analisi bot avanzata", "Utenti multipli", "Accesso API", "White Label", "Supporto prioritario"],
    },
  },
  zh: {
    back: "← 首页", title: "价格", sub: "选择适合你的方案和付款方式。",
    monthly: "月付", yearly: "年付", discount: "优惠 30%", freeDesc: "一次性试用",
    current: "当前方案", default: "默认", popular: "最受欢迎", perMonth: "月", perYear: "年",
    yearlySave: "节省", loading: "加载中...",
    subBtn: "🔁 订阅（自动续费）", onceBtn: "💎 一次性购买", onceNote: "支持加密货币 · 不续费",
    secure: "安全支付 · Dodo Payments",
    features: {
      free: ["1 次免费抽奖", "最多 200 名参与者", "点赞检查", "转推检查", "结果证书"],
      starter: ["无限抽奖", "最多 5,000 名参与者", "点赞和转推检查", "评论和关注检查", "提及和关键词规则", "候补获奖者", "CSV 导出", "结果证书"],
      pro: ["无限抽奖", "最多 40,000 名参与者", "Starter 功能", "额外 X 账号关注", "头像检查", "最低粉丝数", "最短评论长度", "机器人/垃圾过滤", "优先扫描"],
      business: ["无限抽奖", "最多 300,000 名参与者", "Pro 功能", "账号年龄检查", "私密账号过滤", "高级机器人分析", "多用户", "API 访问", "白标", "优先支持"],
    },
  },
  ru: {
    back: "← Главная", title: "Цены", sub: "Выберите план и способ оплаты.",
    monthly: "Месяц", yearly: "Год", discount: "скидка 30%", freeDesc: "Разовая проба",
    current: "Текущий план", default: "По умолчанию", popular: "ПОПУЛЯРНЫЙ", perMonth: "мес", perYear: "год",
    yearlySave: "экономия", loading: "Загрузка...",
    subBtn: "🔁 Подписка (автопродление)", onceBtn: "💎 Разовая покупка", onceNote: "Крипто · без продления",
    secure: "Безопасная оплата · Dodo Payments",
    features: {
      free: ["1 бесплатный розыгрыш", "До 200 участников", "Проверка лайка", "Проверка ретвита", "Сертификат результата"],
      starter: ["Безлимитные розыгрыши", "До 5.000 участников", "Проверка лайка и ретвита", "Проверка комментария и подписки", "Упоминание и ключевое слово", "Запасные победители", "CSV экспорт", "Сертификат результата"],
      pro: ["Безлимитные розыгрыши", "До 40.000 участников", "Функции Starter", "Подписка на доп. X аккаунт", "Проверка аватара", "Минимум подписчиков", "Мин. длина комментария", "Фильтр ботов/спама", "Приоритетное сканирование"],
      business: ["Безлимитные розыгрыши", "До 300.000 участников", "Функции Pro", "Проверка возраста аккаунта", "Фильтр закрытых аккаунтов", "Расширенный анализ ботов", "Несколько пользователей", "API доступ", "White Label", "Приоритетная поддержка"],
    },
  },
  ko: {
    back: "← 홈", title: "요금제", sub: "필요에 맞는 플랜과 결제 방식을 선택하세요.",
    monthly: "월간", yearly: "연간", discount: "30% 할인", freeDesc: "1회 체험",
    current: "현재 플랜", default: "기본", popular: "가장 인기", perMonth: "월", perYear: "년",
    yearlySave: "절약", loading: "로딩 중...",
    subBtn: "🔁 구독 (자동 갱신)", onceBtn: "💎 일회성 구매", onceNote: "암호화폐 가능 · 갱신 없음",
    secure: "안전 결제 · Dodo Payments",
    features: {
      free: ["무료 추첨 1회", "참가자 최대 200명", "좋아요 확인", "리트윗 확인", "결과 인증서"],
      starter: ["무제한 추첨", "참가자 최대 5,000명", "좋아요 및 리트윗 확인", "댓글 및 팔로우 확인", "멘션 및 키워드 규칙", "예비 당첨자", "CSV 내보내기", "결과 인증서"],
      pro: ["무제한 추첨", "참가자 최대 40,000명", "Starter 기능", "추가 X 계정 팔로우", "프로필 사진 확인", "최소 팔로워", "최소 댓글 길이", "봇/스팸 필터", "우선 스캔"],
      business: ["무제한 추첨", "참가자 최대 300,000명", "Pro 기능", "계정 나이 확인", "비공개 계정 필터", "고급 봇 분석", "다중 사용자", "API 접근", "화이트 라벨", "우선 지원"],
    },
  },
  el: {
    back: "← Αρχική", title: "Τιμές", sub: "Επιλέξτε πλάνο και τρόπο πληρωμής.",
    monthly: "Μηνιαίο", yearly: "Ετήσιο", discount: "30% έκπτωση", freeDesc: "Μία δοκιμή",
    current: "Τρέχον πλάνο", default: "Προεπιλογή", popular: "ΔΗΜΟΦΙΛΕΣ", perMonth: "μήνα", perYear: "έτος",
    yearlySave: "εξοικονόμηση", loading: "Φόρτωση...",
    subBtn: "🔁 Συνδρομή (αυτόμ. ανανέωση)", onceBtn: "💎 Εφάπαξ αγορά", onceNote: "Κρύπτο · χωρίς ανανέωση",
    secure: "Ασφαλής πληρωμή · Dodo Payments",
    features: {
      free: ["1 δωρεάν κλήρωση", "Έως 200 συμμετέχοντες", "Έλεγχος like", "Έλεγχος retweet", "Πιστοποιητικό αποτελέσματος"],
      starter: ["Απεριόριστες κληρώσεις", "Έως 5.000 συμμετέχοντες", "Έλεγχος like και retweet", "Έλεγχος σχολίου και follow", "Mention και λέξη-κλειδί", "Αναπληρωματικοί νικητές", "Εξαγωγή CSV", "Πιστοποιητικό αποτελέσματος"],
      pro: ["Απεριόριστες κληρώσεις", "Έως 40.000 συμμετέχοντες", "Λειτουργίες Starter", "Follow επιπλέον X λογαριασμού", "Έλεγχος φωτογραφίας προφίλ", "Ελάχιστοι ακόλουθοι", "Ελάχιστο μήκος σχολίου", "Φίλτρο bot/spam", "Προτεραιότητα σάρωσης"],
      business: ["Απεριόριστες κληρώσεις", "Έως 300.000 συμμετέχοντες", "Λειτουργίες Pro", "Έλεγχος ηλικίας λογαριασμού", "Φίλτρο ιδιωτικών λογαριασμών", "Προηγμένη ανάλυση bot", "Πολλαπλοί χρήστες", "Πρόσβαση API", "White Label", "Προτεραιότητα υποστήριξης"],
    },
  },
  pl: {
    back: "← Strona główna", title: "Cennik", sub: "Wybierz plan i sposób płatności.",
    monthly: "Miesięcznie", yearly: "Rocznie", discount: "30% zniżki", freeDesc: "Jednorazowy test",
    current: "Aktualny plan", default: "Domyślny", popular: "NAJPOPULARNIEJSZY", perMonth: "mies.", perYear: "rok",
    yearlySave: "oszczędzasz", loading: "Ładowanie...",
    subBtn: "🔁 Subskrypcja (auto-odnawianie)", onceBtn: "💎 Zakup jednorazowy", onceNote: "Krypto · bez odnawiania",
    secure: "Bezpieczna płatność · Dodo Payments",
    features: {
      free: ["1 darmowe losowanie", "Do 200 uczestników", "Sprawdzenie polubienia", "Sprawdzenie retweetu", "Certyfikat wyniku"],
      starter: ["Nielimitowane losowania", "Do 5.000 uczestników", "Sprawdzenie polubienia i retweetu", "Sprawdzenie komentarza i obserwacji", "Oznaczenie i słowo kluczowe", "Zwycięzcy rezerwowi", "Eksport CSV", "Certyfikat wyniku"],
      pro: ["Nielimitowane losowania", "Do 40.000 uczestników", "Funkcje Starter", "Obserwacja dodatkowego konta X", "Sprawdzenie zdjęcia profilowego", "Minimum obserwujących", "Minimalna długość komentarza", "Filtr bot/spam", "Priorytetowe skanowanie"],
      business: ["Nielimitowane losowania", "Do 300.000 uczestników", "Funkcje Pro", "Sprawdzenie wieku konta", "Filtrowanie prywatnych kont", "Zaawansowana analiza botów", "Wielu użytkowników", "Dostęp API", "White Label", "Priorytetowe wsparcie"],
    },
  },
  ro: {
    back: "← Acasă", title: "Prețuri", sub: "Alege planul și metoda de plată.",
    monthly: "Lunar", yearly: "Anual", discount: "30% reducere", freeDesc: "Test unic",
    current: "Plan curent", default: "Implicit", popular: "CEL MAI POPULAR", perMonth: "lună", perYear: "an",
    yearlySave: "economisești", loading: "Se încarcă...",
    subBtn: "🔁 Abonament (reînnoire auto)", onceBtn: "💎 Achiziție unică", onceNote: "Cripto · fără reînnoire",
    secure: "Plată securizată · Dodo Payments",
    features: {
      free: ["1 extragere gratuită", "Până la 200 participanți", "Verificare like", "Verificare retweet", "Certificat rezultat"],
      starter: ["Extrageri nelimitate", "Până la 5.000 participanți", "Verificare like și retweet", "Verificare comentariu și follow", "Mențiune și cuvânt cheie", "Câștigători de rezervă", "Export CSV", "Certificat rezultat"],
      pro: ["Extrageri nelimitate", "Până la 40.000 participanți", "Funcții Starter", "Follow cont X suplimentar", "Verificare poză profil", "Minim urmăritori", "Lungime minimă comentariu", "Filtru bot/spam", "Scanare prioritară"],
      business: ["Extrageri nelimitate", "Până la 300.000 participanți", "Funcții Pro", "Verificare vârstă cont", "Filtrare conturi private", "Analiză bot avansată", "Utilizatori multipli", "Acces API", "White Label", "Suport prioritar"],
    },
  },
};

export default function PricingPage() {
  const [interval, setIntervalState] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [lang, setLang] = useState("tr");

  const txt = PT[lang] || PT.en;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dp_lang") || localStorage.getItem("drawpicker_lang");
      if (saved && PT[saved]) setLang(saved);
    } catch {}

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);
        const { data: dbUser } = await supabase.from("users").select("plan").eq("id", data.user.id).single();
        if (dbUser) setUserPlan(dbUser.plan);
      }
    });
  }, []);

  async function handleCheckout(plan: string, mode: "subscription" | "one_time") {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    setLoading(`${plan}-${mode}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval, mode }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Error");
      }
    } catch {
      alert("Connection error");
    }
    setLoading(null);
  }

  const plans = [
    { key: "starter", ...PLANS.starter, popular: false },
    { key: "pro", ...PLANS.pro, popular: true },
    { key: "business", ...PLANS.business, popular: false },
  ];

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition">{txt.back}</a>
          <LangPicker lang={lang} setLang={setLang} accentHover="hover:border-sky-500" accentCheck="text-sky-400" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">{txt.title}</span>
          </h1>
          <p className="text-zinc-400 mb-8">{txt.sub}</p>

          <div className="inline-flex bg-[#16161f] border border-white/10 rounded-2xl p-1 mb-2">
            <button onClick={() => setIntervalState("monthly")} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${interval === "monthly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              {txt.monthly}
            </button>
            <button onClick={() => setIntervalState("yearly")} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${interval === "yearly" ? "bg-sky-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              {txt.yearly}<span className="text-green-400 text-xs ml-1">{txt.discount}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-black text-xl mb-1">{PLANS.free.name}</div>
            <div className="text-zinc-400 text-sm">{txt.freeDesc}</div>
          </div>
          <div className="text-3xl font-black">$0</div>
          <ul className="text-zinc-400 text-sm space-y-1">
            {txt.features.free.map((f: string, i: number) => <li key={i}>✓ {f}</li>)}
          </ul>
          <div className="bg-zinc-700 text-zinc-400 px-4 py-2 rounded-xl text-sm font-bold">
            {userPlan === "free" ? txt.current : txt.default}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price = interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isCurrentPlan = userPlan === plan.key;
            const featureList = txt.features[plan.key] || plan.features;
            const subLoading = loading === `${plan.key}-subscription`;
            const onceLoading = loading === `${plan.key}-one_time`;

            return (
              <div key={plan.key} className={`bg-[#16161f] border rounded-3xl p-6 flex flex-col relative ${plan.popular ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-white/10"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-full">{txt.popular}</div>
                )}

                <div className="font-black text-2xl mb-1">{plan.name}</div>
                <div className="text-4xl font-black mb-1">
                  ${price}<span className="text-zinc-500 text-base font-normal">/{interval === "yearly" ? txt.perYear : txt.perMonth}</span>
                </div>
                {interval === "yearly" && (
                  <div className="text-green-400 text-xs mb-4">${(price / 12).toFixed(0)} / {txt.perMonth} — {txt.yearlySave}</div>
                )}

                <ul className="space-y-2 mb-6 flex-1 mt-3">
                  {featureList.map((f: string, i: number) => (
                    <li key={i} className="text-zinc-400 text-sm flex items-center gap-2"><span className="text-green-400">✓</span> {f}</li>
                  ))}
                </ul>

                {/* Abonelik */}
                <button
                  onClick={() => handleCheckout(plan.key, "subscription")}
                  disabled={subLoading || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition mb-2 ${isCurrentPlan ? "bg-zinc-700 text-zinc-400 cursor-default" : plan.popular ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}
                >
                  {subLoading ? `⏳ ${txt.loading}` : isCurrentPlan ? `✓ ${txt.current}` : txt.subBtn}
                </button>

                {/* Tek seferlik (kripto) */}
                <button
                  onClick={() => handleCheckout(plan.key, "one_time")}
                  disabled={onceLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/15 hover:border-sky-500 text-white transition"
                >
                  {onceLoading ? `⏳ ${txt.loading}` : txt.onceBtn}
                </button>
                <p className="text-center text-zinc-500 text-[11px] mt-2">{txt.onceNote}</p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-zinc-600 text-sm mt-8">{txt.secure}</p>
      </div>
    </main>
  );
}
