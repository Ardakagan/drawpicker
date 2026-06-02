import type { User } from "./types";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function normalize(v: any) {
  return String(v || "").toLowerCase().replace(/^@/, "").trim();
}

export function userKey(u: User) {
  return String(u.userId || u.username || u.id || "").toLowerCase().trim();
}

export function getCursor(data: any) {
  return (
    data?.next_cursor ||
    data?.nextCursor ||
    data?.next_token ||
    data?.nextToken ||
    data?.cursor ||
    data?.meta?.next_cursor ||
    data?.pagination?.next_cursor ||
    ""
  );
}
