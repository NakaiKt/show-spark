/**
 * Supabase クライアント（フロントエンド用）
 * ブラウザで動作するクライアント
 */

import { createBrowserClient } from "@supabase/ssr";

export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
