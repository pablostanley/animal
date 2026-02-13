import { NextResponse } from "next/server";
import { ANIMAL_MANIFEST } from "@vercel/animal";

export function GET() {
  return NextResponse.json(ANIMAL_MANIFEST, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

