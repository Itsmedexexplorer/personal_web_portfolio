import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthed } from "@/lib/auth";

// Issues short-lived upload tokens so the browser can send files straight to Blob storage
// (server functions cap request bodies at 4.5 MB). Only a signed-in studio session gets a token.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAuthed())) throw new Error("Not signed in");
        if (!/^(uploads|resume)\//.test(pathname)) throw new Error("Bad upload path");
        return {
          allowedContentTypes: pathname.startsWith("resume/")
            ? ["application/pdf"]
            : ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
