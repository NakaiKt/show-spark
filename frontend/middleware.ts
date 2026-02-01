import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const NO_AUTH_PATHS = ["/signin", "/signup", "/auth/callback"];

export async function middleware(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
    );
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  // 認証が必要なパスで、かつユーザーがログインしていない
  if (!NO_AUTH_PATHS.includes(pathname) && !user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 認証が不要なパスで、かつユーザーがログインしている
  if (NO_AUTH_PATHS.includes(pathname) && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
