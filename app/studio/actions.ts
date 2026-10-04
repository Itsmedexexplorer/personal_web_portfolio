"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkLogin, endSession, isAuthed, startSession } from "@/lib/auth";
import { CONTENT_TAG, listVersions, restoreVersion, writeContent, type Version } from "@/lib/content/store";
import type { Content } from "@/lib/content/types";

export type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

async function guard() {
  if (!(await isAuthed())) throw new Error("Your session has expired. Sign in again.");
}

/** Expire the cache so every visitor gets the new content on their next request. */
function publish() {
  updateTag(CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function login(_: unknown, form: FormData): Promise<{ error?: string }> {
  const res = await checkLogin({
    password: String(form.get("password") ?? ""),
    secret: String(form.get("secret") ?? ""),
    code: String(form.get("code") ?? ""),
  });
  if (!res.ok) return { error: res.error };
  await startSession();
  redirect("/studio");
}

export async function logout() {
  await endSession();
  redirect("/studio");
}

export async function saveContent(content: Content): Promise<Result<Content>> {
  try {
    await guard();
    const saved = await writeContent(content);
    publish();
    return { ok: true, data: saved };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function versions(): Promise<Result<Version[]>> {
  try {
    await guard();
    return { ok: true, data: await listVersions() };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function restore(url: string): Promise<Result<Content>> {
  try {
    await guard();
    const content = await restoreVersion(url);
    publish();
    return { ok: true, data: content };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
