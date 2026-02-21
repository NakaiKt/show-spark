# Frontend - Show Spark

アニメスケジュール管理ツールのフロントエンド（Next.js 15 + TypeScript）

## 起動方法

```bash
# 依存関係インストール（初回のみ）
npm install

# 開発サーバー起動
npm run dev
```

## 環境変数

`.env.local` を作成:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key>
```

※ `npx supabase status` で表示される値を使用

## その他コマンド

```bash
# 型チェック
npm run type-check

# リント
npm run lint

# ビルド
npm run build
```
