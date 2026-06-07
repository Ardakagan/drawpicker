import type { Rules, User } from "./types";

function cleanText(v: any) {
  return String(v || "").trim().toLowerCase();
}

function cleanUsername(v: any) {
  return String(v || "")
    .trim()
    .replace("@", "")
    .toLowerCase();
}

export function applyLocalFilters(
  user: User,
  rules: Rules = {},
  excluded: string[] = []
) {
  const {
    minFollowers,
    minLength,
    keyword,
    mentionUsername,
    blockHidden,
    blockPrevious,
    aiSafe,
    advancedBotFilter,
    accountAgeDays,
    mustProfile,
    mustName,
    mustBio,
    minMentions,
    minPosts,
  } = rules as any;

  if (minFollowers && (user.followers || 0) < Number(minFollowers)) {
    return false;
  }

  if (minLength) {
    const comment = cleanText((user as any).comment || (user as any).text || "");
    if (comment.length < Number(minLength)) return false;
  }

  if (keyword) {
    const comment = cleanText((user as any).comment || (user as any).text || "");
    if (!comment.includes(cleanText(keyword))) return false;
  }

  if (mentionUsername) {
    const comment = cleanText((user as any).comment || (user as any).text || "");
    const mention = cleanUsername(mentionUsername);
    if (mention && !comment.includes(`@${mention}`)) return false;
  }

  // En az etiket sayisi (yorumdaki @mention sayisi)
  if (minMentions) {
    const comment = cleanText((user as any).comment || (user as any).text || "");
    const count = (comment.match(/@[a-z0-9_]+/gi) || []).length;
    if (count < Number(minMentions)) return false;
  }

  // En az gonderi sayisi (veri varsa uygula)
  if (minPosts) {
    const posts = (user as any).posts;
    if (posts !== undefined && posts !== null && Number(posts) < Number(minPosts)) {
      return false;
    }
  }

  // Profil fotografi olmali
  if (mustProfile) {
    const pic = String(
      user.profilePicture || (user as any).avatar || (user as any).profileImage || ""
    );
    if (!pic || /default_profile|default-avatar|sticky\/default/i.test(pic)) {
      return false;
    }
  }

  // Profilde isim olmali
  if (mustName) {
    const nm = cleanText(user.author || (user as any).name || "");
    if (!nm || nm === "unknown" || nm === "bilinmeyen") return false;
  }

  // Biyografi dolu olmali (veri varsa uygula)
  if (mustBio) {
    const bio = String((user as any).bio || "").trim();
    if (bio !== undefined && (user as any).bio !== undefined && bio.length === 0) {
      return false;
    }
  }

  if (blockHidden && user.isPrivate) {
    return false;
  }

  if (accountAgeDays && (user as any).createdAt) {
    const created = new Date((user as any).createdAt).getTime();
    const minAgeMs = Number(accountAgeDays) * 24 * 60 * 60 * 1000;

    if (!Number.isNaN(created)) {
      const ageMs = Date.now() - created;
      if (ageMs < minAgeMs) return false;
    }
  }

  if (blockPrevious) {
    const cand = [user.userId, user.id, user.username]
      .map((v) => cleanUsername(v))
      .filter(Boolean);
    const ex = excluded.map((e) => cleanUsername(e));
    if (cand.some((k) => ex.includes(k))) return false;
  }

  if (aiSafe) {
    const bad = ["spam", "fake", "bot", "scam"];
    const text = cleanText(user.name || user.author || user.username || "");
    if (bad.some((w) => text.includes(w))) return false;
  }

  // Gelismis bot filtresi (aiSafe'ten daha siki)
  if (advancedBotFilter) {
    const text = cleanText(user.name || user.author || user.username || "");
    const bad = ["spam", "fake", "bot", "scam", "airdrop", "promo", "f4f", "follow4follow"];
    if (bad.some((w) => text.includes(w))) return false;
    const un = String(user.username || "");
    if (un.length > 3) {
      const digits = (un.match(/\d/g) || []).length;
      if (digits / un.length > 0.5) return false;
    }
  }

  return true;
}
