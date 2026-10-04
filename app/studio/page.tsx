import type { Metadata } from "next";
import { authConfigured, isAuthed, totpRequired } from "@/lib/auth";
import { getContentFresh, storageReady, uploadsReady } from "@/lib/content/store";
import Login from "@/components/studio/Login";
import Editor from "@/components/studio/Editor";
import "./studio.css";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  if (!(await isAuthed())) {
    return <Login configured={authConfigured()} needsCode={totpRequired()} />;
  }
  const content = await getContentFresh();
  return <Editor initial={content} storage={storageReady()} uploads={uploadsReady()} local={storageReady() && !uploadsReady()} />;
}
