# シードファイルルール

## ファイル命名規則

```
supabase/seeds/
├── 01_auth_users.sql      # auth.users + auth.identities
├── 02_users.sql           # public.users
├── 03_master_data.sql     # 参照テーブル（themes, color_palettes 等）
├── 04_seasons.sql         # seasons + user_season_links
└── ...
```

- `01_`, `02_` のプレフィックスで実行順を制御
- `scripts/build-seed.js` がプレフィックス順にソートして `supabase/seed.sql` に結合する
- `supabase db reset` 時にシードが自動実行される

## 冪等性の確保

シードは何度実行しても同じ結果になるよう `ON CONFLICT` を使う：

```sql
-- INSERT + ON CONFLICT パターン
INSERT INTO public.users (id, name, avatar_url)
VALUES ('11111111-...'::uuid, '田中太郎', 'https://...')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
```

- `ON CONFLICT (id) DO NOTHING` — 存在すればスキップ（auth.users 向き）
- `ON CONFLICT (id) DO UPDATE SET ...` — 存在すれば更新（public テーブル向き）

## auth.users と public.users の両方が必要な理由

Supabase Auth はユーザー情報を `auth.users`（内部テーブル）に保持する。アプリ固有のプロフィールは `public.users` に格納する。シードでは両方にデータを入れる必要がある：

1. `01_auth_users.sql` — `auth.users` + `auth.identities` にテストユーザーを挿入
2. `02_users.sql` — `public.users` にプロフィールデータを挿入

`handle_new_user` トリガーは `auth.users` への INSERT 時に発火するが、シードデータは `ON CONFLICT` で重複を防いでいるため安全。

## build-seed.js の使い方

```bash
node scripts/build-seed.js
```

- `supabase/seeds/` 配下の `.sql` ファイルをプレフィックス順に結合
- 出力先: `supabase/seed.sql`
- `supabase db reset` は `seed.sql` を自動実行するため、シード追加後はビルドしてからリセット

## テストデータ追加時の注意点

- UUID は分かりやすいパターンを使う（例: `11111111-1111-1111-1111-111111111111`）
- auth.users のパスワードは `crypt('password', gen_salt('bf'))` で暗号化
- FK 制約があるため、依存先のデータを先に投入する（ファイルのプレフィックス順で制御）
- 本番データ（個人情報等）は絶対にシードに含めない
