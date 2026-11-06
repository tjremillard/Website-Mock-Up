import { NextRequest, NextResponse } from "next/server";
import { validVisionSession, visionCookie } from "@/lib/air/vision-auth";
export function proxy(request: NextRequest) {
  let response: NextResponse;
  if (validVisionSession(request.cookies.get(visionCookie)?.value)) {
    response = NextResponse.next();
  } else {
    const url = new URL("/vision-access", request.url);
    url.searchParams.set(
      "returnTo",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    response = NextResponse.redirect(url);
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/vision/:path*"] };
