/**
 * Supabase クライアント（フロントエンド用）
 * ブラウザで動作するクライアント
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || ""
  );
}
