// =============================================
// BURADAN FİYAT, LİMİT VE DODO ÜRÜN ID'LERİNİ DEĞİŞTİREBİLİRSİN
//
// Her plan için 4 Dodo ürün ID'si var:
//   dodoSubMonthlyId / dodoSubYearlyId   -> ABONELİK (otomatik yenilenen)
//   dodoOnceMonthlyId / dodoOnceYearlyId -> TEK SEFERLİK (kripto destekli, yenilenmez)
// Tek seferlik ID'leri Dodo'da "One-Time" tipinde açıp buraya yapıştır.
// =============================================

export const PLANS = {
  free: {
    name: "Free",
    drawsPerMonth: 1,
    maxParticipants: 200,
    monthlyPrice: 0,
    yearlyPrice: 0,
    dodoSubMonthlyId: "",
    dodoSubYearlyId: "",
    dodoOnceMonthlyId: "",
    dodoOnceYearlyId: "",
    dodoMonthlyId: "",
    dodoYearlyId: "",
    features: [
      "1 ücretsiz çekiliş",
      "200 aylık katılımcı işleme limiti",
      "Tweet beğeni kontrolü",
      "Retweet kontrolü",
      "Sonuç sertifikası",
    ],
    allowedRules: ["mustLike", "mustRetweet", "mustComment", "mustFollow", "mustKeyword", "mustMention", "mustMinLength", "uniqueComments", "mustProfile", "mustMinFollowers", "mustExtraFollow", "aiSafe", "mustAccountAge", "blockHidden", "advancedBotFilter", "mustName", "mustBio", "mustMinMentions", "mustMinPosts"],
  },

  starter: {
    name: "Bronz",
    drawsPerMonth: 999999,
    maxParticipants: 5000,
    monthlyPrice: 8.99,
    yearlyPrice: 53.99,
    // ABONELİK (mevcut)
    dodoSubMonthlyId: "pdt_0NgG5U0kp4o6A0gY11X6H",
    dodoSubYearlyId: "pdt_0NgG7MLWkcZetxB1Iabvg",
    dodoMonthlyId: "pdt_0NgG5U0kp4o6A0gY11X6H",
    dodoYearlyId: "pdt_0NgG7MLWkcZetxB1Iabvg",
    // TEK SEFERLİK (One-Time)
    dodoOnceMonthlyId: "pdt_0NgUSz67S5m6fdiEQb2tN",
    dodoOnceYearlyId: "pdt_0NgUT5mSUYAQvxB9TzVSH",
    features: [
      "Sınırsız çekiliş",
      "5.000 aylık katılımcı işleme limiti",
      "Tweet beğeni kontrolü",
      "Retweet kontrolü",
      "Yorum kontrolü",
      "Ana hesabı takip kontrolü",
      "Etiketleme kuralı",
      "Anahtar kelime kuralı",
      "Yedek kazanan seçimi",
      "CSV export",
      "Sonuç sertifikası",
    ],
    allowedRules: ["mustLike", "mustRetweet", "mustComment", "mustFollow", "mustKeyword", "mustMention", "mustMinLength", "uniqueComments", "mustProfile", "mustMinFollowers", "mustExtraFollow", "aiSafe", "mustAccountAge", "blockHidden", "advancedBotFilter", "mustName", "mustBio", "mustMinMentions", "mustMinPosts"],
  },

  pro: {
    name: "Gümüş",
    drawsPerMonth: 999999,
    maxParticipants: 40000,
    monthlyPrice: 17.99,
    yearlyPrice: 109.99,
    dodoSubMonthlyId: "pdt_0NgG7hDSAhJlPT8wqC8Be",
    dodoSubYearlyId: "pdt_0NgG8CoAcTJo4YvlBa3Jw",
    dodoMonthlyId: "pdt_0NgG7hDSAhJlPT8wqC8Be",
    dodoYearlyId: "pdt_0NgG8CoAcTJo4YvlBa3Jw",
    dodoOnceMonthlyId: "pdt_0NgUThftpqarrV7lNW8Gj",
    dodoOnceYearlyId: "pdt_0NgUTwVxAsdBFtFcevbV2",
    features: [
      "Sınırsız çekiliş",
      "40.000 aylık katılımcı işleme limiti",
      "Starter özellikleri",
      "Ek X hesabı takip kontrolü",
      "Çoklu hesap takibi",
      "Profil fotoğrafı kontrolü",
      "Minimum takipçi kuralı",
      "Minimum yorum uzunluğu",
      "Tekrarlanan yorum = 1 hak",
      "Bot / spam filtresi",
      "Geçmiş çekilişler",
      "Öncelikli tarama",
    ],
    allowedRules: ["mustLike", "mustRetweet", "mustComment", "mustFollow", "mustKeyword", "mustMention", "mustMinLength", "uniqueComments", "mustProfile", "mustMinFollowers", "mustExtraFollow", "aiSafe", "mustAccountAge", "blockHidden", "advancedBotFilter", "mustName", "mustBio", "mustMinMentions", "mustMinPosts"],
  },

  business: {
    name: "Altın",
    drawsPerMonth: 999999,
    maxParticipants: 300000,
    monthlyPrice: 27.99,
    yearlyPrice: 179.90,
    dodoSubMonthlyId: "pdt_0NgG8R5pz4qs9SgFBZN1s",
    dodoSubYearlyId: "pdt_0NgG8vSR1omLndnKZ7pF2",
    dodoMonthlyId: "pdt_0NgG8R5pz4qs9SgFBZN1s",
    dodoYearlyId: "pdt_0NgG8vSR1omLndnKZ7pF2",
    dodoOnceMonthlyId: "pdt_0NgUUBJO4rIBqizFbhuFD",
    dodoOnceYearlyId: "pdt_0NgUUJIJnH0SAaUUEAajL",
    features: [
      "Sınırsız çekiliş",
      "300.000 aylık katılımcı işleme limiti",
      "Pro özellikleri",
      "Hesap yaşı kontrolü",
      "Gizli hesap filtreleme",
      "Gelişmiş bot analizi",
      "Çoklu kullanıcı",
      "İstatistik paneli",
      "API erişimi",
      "White Label",
      "Özel destek",
    ],
    allowedRules: ["mustLike", "mustRetweet", "mustComment", "mustFollow", "mustKeyword", "mustMention", "mustMinLength", "uniqueComments", "mustProfile", "mustMinFollowers", "mustExtraFollow", "aiSafe", "mustAccountAge", "blockHidden", "advancedBotFilter", "mustName", "mustBio", "mustMinMentions", "mustMinPosts"],
  },

  diamond: {
    name: "Pırlanta",
    drawsPerMonth: 999999,
    maxParticipants: 1000000,
    monthlyPrice: 37.99,
    yearlyPrice: 239.90,
    dodoSubMonthlyId: "pdt_0NgUpVSaixjZy5QRIAjZZ",
    dodoSubYearlyId: "pdt_0NgUpMO9h7GOWautZW6Ut",
    dodoMonthlyId: "pdt_0NgUpVSaixjZy5QRIAjZZ",
    dodoYearlyId: "pdt_0NgUpMO9h7GOWautZW6Ut",
    dodoOnceMonthlyId: "pdt_0NgUp4kxrqfwrsTJNUIO9",
    dodoOnceYearlyId: "pdt_0NgUpDuZyqvKXQAUoe4fB",
    features: [
      "Sınırsız çekiliş",
      "1.000.000 aylık katılımcı işleme limiti",
      "Altın tüm özellikleri",
      "7/24 öncelikli destek",
      "Özel entegrasyon & SLA",
      "En yüksek tarama önceliği",
    ],
    allowedRules: ["mustLike", "mustRetweet", "mustComment", "mustFollow", "mustKeyword", "mustMention", "mustMinLength", "uniqueComments", "mustProfile", "mustMinFollowers", "mustExtraFollow", "aiSafe", "mustAccountAge", "blockHidden", "advancedBotFilter", "mustName", "mustBio", "mustMinMentions", "mustMinPosts"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlan(key: string) {
  return PLANS[key as PlanKey] || PLANS.free;
}

// mode: "subscription" | "one_time", interval: "monthly" | "yearly"
export function getDodoProductId(
  planKey: string,
  mode: "subscription" | "one_time",
  interval: "monthly" | "yearly"
): string {
  const p = getPlan(planKey) as any;
  if (mode === "one_time") {
    return interval === "yearly" ? p.dodoOnceYearlyId : p.dodoOnceMonthlyId;
  }
  return interval === "yearly" ? p.dodoSubYearlyId : p.dodoSubMonthlyId;
}

export function canDraw(
  plan: string,
  drawsThisMonth: number,
  participantCount: number
): { allowed: boolean; reason?: string } {
  const p = getPlan(plan);

  if (drawsThisMonth >= p.drawsPerMonth) {
    return { allowed: false, reason: "monthly_limit" };
  }

  if (participantCount > p.maxParticipants) {
    return { allowed: false, reason: "participant_limit" };
  }

  return { allowed: true };
}

export function canUseRule(plan: string, ruleKey: string): boolean {
  const p = getPlan(plan);
  return (p.allowedRules as readonly string[]).includes(ruleKey);
}
