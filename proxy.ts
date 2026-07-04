import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/listings") ||
    pathname.startsWith("/staging") || pathname.startsWith("/settings") ||
    pathname.startsWith("/videos") || pathname.startsWith("/test");
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (!isProtected && !isAuth) {
    return NextResponse.next({ request });
  }

  // Supabase session cookie: sb-<project>-auth-token (large sessions are
  // chunked by @supabase/ssr into sb-<project>-auth-token.0, .1, etc.)
  const cookies = request.cookies.getAll();
  const hasSession = cookies.some(
    (c) => c.name.startsWith("sb-") && /-auth-token(\.\d+)?$/.test(c.name) && c.value.length > 10
  );

  if (!hasSession && isProtected) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    return NextResponse.redirect(redirect);
  }

  if (hasSession && isAuth) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/dashboard";
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
