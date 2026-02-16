import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await props.params;

  // Sanitize: allow only alphanumeric characters, hyphens, and forward slashes
  const path = slug.join("/");
  if (!/^[a-z0-9-/]+$/.test(path)) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const filePath = join(process.cwd(), "content", "docs", `${path}.mdx`);

  try {
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
