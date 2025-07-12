import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { accountFlag, jobFlag } from "./app/module/flag";

export async function middleware(request: NextRequest) {
  // Define route-to-flag mappings
  const protectedRoutes = [
    { path: "/account", flag: accountFlag },
    { path: "/job", flag: jobFlag },
  ];

  // Check each protected route
  for (const route of protectedRoutes) {
    if (request.nextUrl.pathname.startsWith(route.path)) {
      const isEnabled = await route.flag();

      if (!isEnabled) {
        console.log(`${route.path} flag is disabled, redirecting to home`);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
