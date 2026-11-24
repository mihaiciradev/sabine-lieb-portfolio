import { NextResponse, type NextRequest } from "next/server";

// Romanian is served at the root, English under /en. Pages live under app/[lang],
// so unprefixed paths are rewritten to /ro, and /ro/... redirects to its clean URL.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generated share images live under the real /ro segment; serve them directly.
  if (/\/(opengraph|twitter)-image/.test(pathname)) return;

  if (pathname === "/ro" || pathname.startsWith("/ro/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) return;

  const url = request.nextUrl.clone();
  url.pathname = `/ro${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, metadata routes and anything with a file extension.
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|llms.txt|manifest.webmanifest|favicon.ico|.*\\..*).*)"],
};
