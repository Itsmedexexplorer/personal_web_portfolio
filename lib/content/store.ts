import "server-only";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { del, list, put } from "@vercel/blob";
import { DEFAULT_CONTENT } from "./defaults";
import { normalizeContent } from "./validate";
import type { Content } from "./types";

// Content lives in Vercel Blob as immutable, timestamped JSON files under content/.
// Every save writes a new file (so no CDN copy can ever be stale), keeps the last few as
// history, and the site's cache tag is expired so the next request renders the new version.
// In local development without a Blob token, the same flow runs against ./.content instead.

export const CONTENT_TAG = "content";
const PREFIX = "content/";
const KEEP = 12;
const LOCAL_DIR = path.join(process.cwd(), ".content");

const blobMode = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const localMode = () => !blobMode() && (process.env.NODE_ENV === "development" || process.env.CONTENT_STORE === "local");
export const storageReady = () => blobMode() || localMode();
/** Uploads need real Blob storage (they go straight from the browser to it). */
export const uploadsReady = blobMode;

export interface Version {
  url: string;
  uploadedAt: string;
  size: number;
}

export async function listVersions(): Promise<Version[]> {
  if (blobMode()) {
    const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
    return blobs
      .map((b) => ({ url: b.url, uploadedAt: new Date(b.uploadedAt).toISOString(), size: b.size }))
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }
  if (localMode()) {
    const names = await readdir(LOCAL_DIR).catch(() => [] as string[]);
    const files = await Promise.all(names.filter((n) => n.endsWith(".json")).map(async (n) => {
      const s = await stat(path.join(LOCAL_DIR, n));
      return { url: `local:${n}`, uploadedAt: s.mtime.toISOString(), size: s.size };
    }));
    return files.sort((a, b) => b.url.localeCompare(a.url));
  }
  return [];
}

async function readVersion(url: string): Promise<Content> {
  if (url.startsWith("local:")) {
    const file = path.join(LOCAL_DIR, path.basename(url.slice(6)));
    return normalizeContent(JSON.parse(await readFile(file, "utf8")));
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not read ${url}: ${res.status}`);
  return normalizeContent(await res.json());
}

async function loadLatest(): Promise<Content> {
  if (!storageReady()) return DEFAULT_CONTENT;
  try {
    const [latest] = await listVersions();
    return latest ? await readVersion(latest.url) : DEFAULT_CONTENT;
  } catch (e) {
    console.error("[content] falling back to bundled content:", e);
    return DEFAULT_CONTENT;
  }
}

/** The content the site renders. Cached until the studio publishes. */
const cachedLatest = unstable_cache(loadLatest, ["site-content"], { tags: [CONTENT_TAG] });
// Normalise after the cache: entries written by an older deploy may predate newer fields.
export const getContent = async (): Promise<Content> => normalizeContent(await cachedLatest());

/** Uncached read for the studio editor. */
export const getContentFresh = loadLatest;

export async function writeContent(input: unknown): Promise<Content> {
  if (!storageReady()) throw new Error("Storage is not connected. Add a Blob store to this project in Vercel.");
  const content = normalizeContent(input);
  content.updatedAt = new Date().toISOString();
  const body = JSON.stringify(content);

  if (blobMode()) {
    await put(`${PREFIX}${Date.now()}.json`, body, {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
      cacheControlMaxAge: 31536000,
    });
  } else {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, `${Date.now()}.json`), body);
  }

  const stale = (await listVersions()).slice(KEEP).map((v) => v.url);
  if (stale.length) {
    if (blobMode()) await del(stale);
    else await Promise.all(stale.map((u) => rm(path.join(LOCAL_DIR, path.basename(u.slice(6))), { force: true })));
  }
  return content;
}

export async function restoreVersion(url: string): Promise<Content> {
  const versions = await listVersions();
  if (!versions.some((v) => v.url === url)) throw new Error("Unknown version");
  return writeContent(await readVersion(url));
}
