# Frontend - Show Spark

アニメスケジュール管理ツールのフロントエンド（Next.js 15 + TypeScript）

---

## 開発環境

### 前提条件

- Docker Desktop がインストールされていること
- Supabase CLI がインストールされていること（`npm install -g supabase`）

---

## Docker環境の立ち上げ方

### 1. Supabase ローカル環境を起動

プロジェクトルート（`/show-spark`）で以下を実行：

```bash
# Supabase ローカル環境を起動
supabase start

# 起動確認（Studio URL が表示される）
# Studio URL: http://localhost:54323
```

### 2. フロントエンド（Next.js）を起動

`/frontend` ディレクトリで以下を実行：

```bash
# Docker イメージをビルド & コンテナを起動
docker-compose up --build

# または、バックグラウンドで起動
docker-compose up -d
```

### 3. ブラウザでプレビューを確認

以下のURLをブラウザで開く：

- **フロントエンド**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323

---

## ホットリロード（変更の即座反映）

Docker環境では、コードを変更すると**自動的にブラウザに反映**されます。

### 動作確認

1. `app/page.tsx` を編集して保存
2. ブラウザが自動的にリロードされる（数秒以内）

**注意**: 
- `package.json` を変更した場合は、コンテナを再ビルドしてください：
  ```bash
  docker-compose down
  docker-compose up --build
  ```

---

## Docker コンテナの操作

### コンテナを停止

```bash
docker-compose down
```

### コンテナの状態を確認

```bash
docker-compose ps
```

### コンテナのログを確認

```bash
docker-compose logs -f
```

### コンテナに入ってコマンド実行

```bash
docker-compose exec frontend sh

# コンテナ内で npm コマンドなどを実行可能
npm run lint
```

---

## 環境変数

開発環境では `docker-compose.yml` で以下の環境変数が自動設定されます：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://localhost:54321` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) | Supabase 匿名キー（ローカル開発用） |

**本番環境の場合**: `.env.local` ファイルを作成して、実際の Supabase プロジェクトの値を設定してください。

---

## トラブルシューティング

### ポート 3000 が既に使われている

```bash
# エラー: Bind for 0.0.0.0:3000 failed: port is already allocated

# 解決策1: 既存のプロセスを停止
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# 解決策2: docker-compose.yml のポートを変更
ports:
  - "3001:3000"  # ホスト側を 3001 に変更
```

### ホットリロードが効かない

```bash
# コンテナを完全に再起動
docker-compose down
docker-compose up --build
```

### node_modules のエラー

```bash
# コンテナ内で依存関係を再インストール
docker-compose exec frontend npm ci
```

---

## 本番環境用（準備中）

本番環境用のDockerfileは `Dockerfile.prod` として別途作成予定です。

---

## ディレクトリ構成

```
frontend/
├── Dockerfile              # 開発用 Dockerfile
├── docker-compose.yml      # Docker Compose 設定
├── .dockerignore           # Docker ビルドから除外するファイル
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── page.tsx            # トップページ
│   └── layout.tsx          # ルートレイアウト
├── components/             # React コンポーネント
├── lib/                    # ユーティリティ・サービス層
├── public/                 # 静的ファイル
├── package.json
└── tsconfig.json
```

---

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
- [Docker Compose ドキュメント](https://docs.docker.com/compose/)
