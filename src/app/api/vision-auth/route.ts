import { NextRequest, NextResponse } from "next/server";
import {
  visionConfigured,
  verifyVisionPassword,
  createVisionSession,
  visionCookie,
  sessionSeconds,
  visionReturn,
} from "@/lib/air/vision-auth";
// A conservative global process budget avoids trusting spoofable IP headers.
// Preview hosting must add a shared edge limit for multi-instance deployment.
let attempts = 0;
let windowStart = Date.now();
function json(message: string, status: number) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return json("Request origin not allowed.", 403);
  if (!visionConfigured())
    return json(
      "Internal preview access is not configured. All vision routes remain locked.",
      503,
    );
  if (Date.now() - windowStart > 15 * 60 * 1000) {
    attempts = 0;
    windowStart = Date.now();
  }
  if (attempts >= 20) {
    const response = json(
      "Too many access attempts. Try again in 15 minutes.",
      429,
    );
    response.headers.set("Retry-After", "900");
    return response;
  }
  attempts++;
  if (Number(request.headers.get("content-length") ?? 0) > 2048)
    return json("Request too large.", 413);
  let data;
  try {
    const text = await request.text();
    if (text.length > 2048) return json("Request too large.", 413);
    data = JSON.parse(text);
  } catch {
    return json("Invalid request.", 400);
  }
  if (
    typeof data?.password !== "string" ||
    !(await verifyVisionPassword(data.password))
  )
    return json("Access denied. Check the internal preview password.", 401);
  const response = NextResponse.json(
    { returnTo: visionReturn(data.returnTo) },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
  response.cookies.set(visionCookie, createVisionSession(), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/vision",
    maxAge: sessionSeconds,
  });
  return response;
}
