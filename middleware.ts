import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const articleSegments = pathname.split("/").filter(Boolean);

  if (
    articleSegments[0] === "articles" &&
    (articleSegments[1] === "en" || articleSegments[1] === "fr")
  ) {
    const redirectUrl = request.nextUrl.clone();
    const [, , ...restSegments] = articleSegments;
    redirectUrl.pathname = `/articles/pt${restSegments.length > 0 ? `/${restSegments.join("/")}` : ""}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/articles") ||
    pathname.startsWith("/blog") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];

  if (!maybeLocale || !isLocale(maybeLocale)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", maybeLocale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
