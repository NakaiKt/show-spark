/**
 * Supabase接続テストページ
 * http://localhost:3000/test でアクセス
 */

import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();

  // usersテーブルから全ユーザーを取得
  const { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>エラー</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supabase接続テスト</h1>
      <h2>ユーザー一覧</h2>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
