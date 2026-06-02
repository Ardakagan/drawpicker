import { Rules, User } from "./types";

export function applyLocalFilters(
  user: User,
  rules: Rules,
  excluded: string[] = []
) {
  const {
    minFollowers,
    blockHidden,
    blockPrevious,
    aiSafe,
  } = rules;

  // minimum follower kontrolü
  if (
    minFollowers &&
    (user.followersCount || 0) < minFollowers
  ) {
    return false;
  }

  // gizli hesap kontrolü
  if (blockHidden && user.isPrivate) {
    return false;
  }

  // önceki kazanan engeli
  if (blockPrevious) {
    const key =
      user.userId ||
      user.id ||
      user.username ||
      "";

    if (key && excluded.includes(key)) {
      return false;
    }
  }

  // basit ai/spam filtresi
  if (aiSafe) {
    const bad = ["