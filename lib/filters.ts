import type { Rules, User } from "./types";

export function applyLocalFilters(
  user: User,
  rules: Rules,
  excluded: string[] = []
) {
  const {
    mustComment,
    mustMention,
    mustKeyword,
    keyword,
    mustMinLength,
    minLen,
    mustProfile,
    mustMinFollowers,
    minFollowers,
    blockHidden,
    blockPrevious,
    aiSafe,
  } = rules;

  const text = user.text || "";

  if (mustComment && !text.trim()) return false;
  if (mustMention && !/@\w+/.test(text)) return false;

  if (mustKeyword && keyword?.trim()) {
    if (!text.toLowerCase().includes(String(keyword).toLowerCase())) return false;
  }

  if (mustMinLength && text.length < Number(minLen || 0)) return false;
  if (mustProfile && !user.profilePicture) return false;
  if (mustMinFollowers && Number(user.followers || 0) < Number(minFollowers || 0))
    return false;
  if (blockHidden && user.isPrivate) return false;
  if (blockPrevious && excluded.includes(user.userId)) return false;

  if (aiSafe) {
    const bad = ["spam", "fake", "bot", "scam"];
    if (bad.some((b) => text.toLowerCase().includes(b))) return false;
  }

  return true;
}
