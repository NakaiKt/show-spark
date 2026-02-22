# マイグレーションルール

## ファイル命名規則

```bash
supabase migration new create_<テーブル名>_table
```

- Supabase CLI がタイムスタンプを自動付与（例: `20251215103359_create_users_table.sql`）
- **1 テーブル 1 ファイル**の原則

## 開発中 vs 本番後のルール


| 環境        | 既存ファイル編集    | 必要な操作                        |
| --------- | ----------- | ---------------------------- |
| ローカル      | 自由に編集 OK    | `supabase db reset`          |
| リモート（dev） | 編集しても反映されない | `supabase db reset --linked` |
| 本番（将来）    | **絶対に編集禁止** | 新しい ALTER マイグレーションを作成        |


## 共通カラムルール

すべてのテーブルに以下の共通カラムを含める：

```sql
-- PK: テーブルに応じて UUID or INTEGER
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
-- or
id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

-- タイムスタンプ（必ず NOT NULL）
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

- 複合 PK のジャンクションテーブル（`user_season_links` 等）は `id` カラム不要
- `created_at` / `updated_at` は **必ず `NOT NULL`** を付ける

## マイグレーションテンプレート

各マイグレーションは以下の順序で記述する：

```
1. テーブル定義（CREATE TABLE）
2. updated_at トリガー（SELECT setup_updated_at_trigger()）
3. RLS 有効化（ALTER TABLE ... ENABLE ROW LEVEL SECURITY）
4. ポリシー定義（CREATE POLICY）
```

### 参照データテーブル（読取専用）

対象: `themes`, `season_roles`, `day_of_weeks`, `content_statuses`, `color_palettes`

```sql
-- コンテンツステータスマスターテーブル
CREATE TABLE public.content_statuses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_atトリガー
SELECT setup_updated_at_trigger('content_statuses');

-- RLS有効化
ALTER TABLE public.content_statuses ENABLE ROW LEVEL SECURITY;

-- ポリシー: 認証済みユーザーは参照のみ可
CREATE POLICY "Authenticated users can view content_statuses"
    ON public.content_statuses FOR SELECT
    USING (auth.uid() IS NOT NULL);
```

### 直接所有テーブル

対象: `users`, `content_tags`

```sql
-- ポリシー例: 自分のデータのみ CRUD
CREATE POLICY "Users can view own content_tags"
    ON public.content_tags FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content_tags"
    ON public.content_tags FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content_tags"
    ON public.content_tags FOR UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content_tags"
    ON public.content_tags FOR DELETE
    USING (auth.uid() = user_id);
```

### シーズン経由の間接所有テーブル

対象: `seasons`, `contents`, `content_related_urls`, `content_tag_links`

```sql
-- ポリシー例: user_season_links を JOIN して所有確認
CREATE POLICY "Season members can view contents"
    ON public.contents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_season_links usl
            WHERE usl.season_id = contents.season_id
            AND usl.user_id = auth.uid()
        )
    );
```

### ジャンクションテーブル

対象: `user_season_links`, `theme_colors`

- 複合 PK を使用（`id` カラムなし）
- ポリシーは各テーブルの要件に応じて個別設計

## FK 依存関係順（作成順序）

1. `color_palettes`（依存なし）
2. `themes`（依存なし）
3. `theme_colors`（→ themes, color_palettes）
4. `day_of_weeks`（→ color_palettes）
5. `content_statuses`（依存なし）
6. `season_roles`（依存なし）
7. `seasons`（依存なし）
8. `user_season_links`（→ users, seasons, season_roles）
9. `contents`（→ seasons, day_of_weeks, content_statuses）
10. `content_tags`（→ users, color_palettes）
11. `content_tag_links`（→ contents, content_tags）
12. `content_related_urls`（→ contents）

## 検証

マイグレーション変更後は必ず以下を実行：

```bash
supabase db reset
```

