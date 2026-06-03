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
    accountAgeDays,
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
    const key = user.userId || user.id || user.username || "";
    if (key && excluded.includes(key)) return false;
  }

  if (aiSafe) {
    const bad = ["spam", "fake", "bot", "scam"];
    const text = cleanText(user.name || user.author || user.username || "");

    if (bad.some((w) => text.includes(w))) {
      return false;
    }
  }

  return true;
}