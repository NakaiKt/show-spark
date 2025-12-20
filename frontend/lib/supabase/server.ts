/**
 * Supabase クライアント（サーバー用）
 * Next.js Server Components / API Routes で動作するクライアント
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  // サーバーサイド（Dockerコンテナ内）からは host.docker.internal を使用
  // クライアントサイド（ブラウザ）からは localhost を使用
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component内では set は使えない（読み取り専用）
        }
      },
    },
  });
}
