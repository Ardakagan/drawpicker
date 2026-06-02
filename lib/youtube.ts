import { sleep } from "./utils";
import { mapYoutubeComment } from "./mappers";
import type { User } from "./types";

export function getVideoId(input: string) {
  const clean = input.trim();
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = clean.match(p);
    if (m) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  return null;
}

async function fetchYoutube(url: string, attempt = 0): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });

    // Geçici hatalar -> tekrar dene
    if ((res.status === 429 || res.status === 503 || res.status === 500) && attempt < 5) {
      await sleep(Math.min(1000 * 2 ** attempt, 8000));
      return fetchYoutube(url, attempt + 1);
    }

    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("YouTube bozuk cevap döndürdü.");
    }

    if (!res.ok) {
      const reason = data?.error?.errors?.[0]?.reason;
      if (reason === "quotaExceeded")
        throw new Error("YouTube API kotası doldu. Yarın tekrar deneyin.");
      if (reason === "commentsDisabled")
        throw new Error("Bu videoda yorumlar kapalı.");
      throw new Error(
        data?.error?.message || `YouTube API hatası (${res.status})`
      );
    }

    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      if (attempt < 3) {
        await sleep(1000 * (attempt + 1));
        return fetchYoutube(url, attempt + 1);
      }
      throw new Error("YouTube çok geç cevap verdi. Lütfen tekrar deneyin.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function collectYoutube(
  input: string,
  apiKey: string,
  onUsers: (users: User[]) => void,
  deadline: number
): Promise<boolean> {
  const videoId = getVideoId(input);
  if (!videoId) throw new Error("Geçerli bir YouTube linki girin.");

  let pageToken = "";
  let pages = 0;
  const maxPages = 1000;
  let truncated = false;

  while (pages < maxPages) {
    if (Date.now() > deadline) {
      truncated = true;
      break;
    }

    const url =
      `https://www.googleapis.com/youtube/v3/commentThreads` +
      `?part=snippet&maxResults=100&textFormat=plainText&videoId=${videoId}&key=${apiKey}` +
      (pageToken ? `&pageToken=${pageToken}` : "");

    const data = await fetchYoutube(url);
    const items = data.items || [];
    if (items.length) onUsers(items.map(mapYoutubeComment));

    if (data.nextPageToken) {
      pageToken = data.nextPageToken;
      pages++;
      await sleep(60);
    } else {
      break;
    }
  }

  return truncated;
}
