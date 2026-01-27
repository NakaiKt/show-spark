# アニメスケジュール管理ツール - プロジェクト概要

## 概要

アニメ視聴スケジュールを効率的に管理するための Web アプリケーション

## 背景

- 来季のアニメ視聴スケジュールを決める際、Miro で手作業管理していた
- Miro は万能ツールだが、以下の点で不便：
  - 曜日ごとの色分けが手動
  - アニメ情報（画像、タイトル、タグ等）の入力が面倒
  - スケジュール特化の機能がない
- この課題を解決しつつ、実務で役立つ技術を学ぶ個人開発プロジェクト

## 目的

- 実際に使えるツールを作る
- 実務レベルの設計・実装経験を積む（採算度外視だが、設計は真剣に）
- 配信者のサポート作業を効率化

## ペルソナ

- 年齢：40 代男性
- 特徴：機械にあまり明るくない、アニメが好き
- 利用シーン：配信前のスケジュール決め、配信中のリアルタイム調整

## 実装する機能

### Phase 1（MVP）

- Google 認証
- Season 作成・切り替え
- コンテンツ CRUD（手動入力）
  - アニメタイトル
  - サムネイル画像
  - 概要
  - メモ（プレーンテキスト）
  - 放送局
  - 放送日時
  - タグ（2 期、2 クール、ショートアニメ等）
  - サイトページへのリンク
  - ステータス（保留 / 確定）
- 曜日別グリッド表示（曜日で自動カラーリング）
- ドラッグ&ドロップでの並び替え
- 共有編集機能（オーナー + エディター方式）
- リアルタイム同期
- ライト・ダークモード切り替え
- アカウント情報表示（デフォルトで非表示）
- アカウント削除

### Phase 2 以降

- Season 間のコンテンツ移動・複製
- API 連携でコンテンツ情報自動取得
- メモ機能の拡張
- Notion 連携

## 技術スタック

### フロントエンド

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- dnd-kit
- Zustand
- Supabase JavaScript Client

### バックエンド・インフラ

- **Next.js API Routes**
  - ビジネスロジック
  - 外部 API 連携
  - バリデーション
- **Supabase**
  - PostgreSQL（データベース）
  - Supabase Auth（Google 認証）
  - Supabase Storage（画像）
  - Supabase Realtime（リアルタイム同期）
  - Edge Functions（必要時のみ、TypeScript/Deno）
- **Vercel**（ホスティング）

### 開発ツール

- **データベーススキーマ管理**：Supabase Migration（SQL）
- **API 仕様**：Next.js API Routes（RESTful）
- **インフラ構築**：Supabase ダッシュボード + CLI で管理
- **バージョン管理**：GitHub
- **開発環境**：ローカル（Node.js + Supabase CLI）
- **Node.js バージョン管理**：fnm（推奨）

### 学習目標

- PostgreSQL/SQL 基礎
- Next.js API Routes（バックエンド API 設計）
- RLS（認証・認可設計）
- リアルタイム機能の実装
- ドラッグ&ドロップ UI 実装（dnd-kit）

### コスト

- Supabase: 無料枠（500MB DB）
- Vercel: 無料枠
- 合計: $0/月

## アーキテクチャ方針

### レイヤー分離

```plaintext
┌─────────────────────────────────────┐
│  フロントエンド (Next.js App Router) │
│  - UI/UX                            │
│  - リアルタイム購読（Supabase直接）  │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  API層 (Next.js API Routes)         │
│  - ビジネスロジック                  │
│  - バリデーション                    │
│  - 外部API連携                       │
│  - トランザクション管理               │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  データ層 (Supabase)                 │
│  - PostgreSQL（スキーマ定義）        │
│  - RLS（認証・認可）                 │
│  - リアルタイム配信                  │
│  - ストレージ                        │
└─────────────────────────────────────┘
```

### 実装方針

#### ✅ Supabase（DB 層）に置くもの

- テーブル定義・スキーマ
- データ整合性制約（NOT NULL, UNIQUE, CHECK, FK）
- RLS（Row Level Security）ポリシー
- `updated_at`自動更新トリガー
- 認証フロー連携（`handle_new_user`トリガー）
- リアルタイム配信設定

#### ✅ Next.js API Routes（アプリ層）に置くもの

**※全てのDB操作はAPI Routes経由で行う（単純CRUDも含む）**

理由：
- ロジックの配置場所が明確（「どこを見ればいい？」問題の解消）
- 後から複雑なロジックが必要になっても移動不要
- バリデーション・エラーハンドリングが統一される

対象：
- **全てのCRUD操作**（単純なものも含む）
- ビジネスロジック
  - 例：「18 歳未満は特定機能を使えない」
  - 例：「1 シーズンあたり最大 50 作品まで」
- バリデーション（Zod）
- 外部 API 連携
  - 例：アニメ情報 API、画像アップロード
- 集計・計算
  - 例：ダッシュボードの統計データ
- トランザクション管理
  - 例：Season 削除時に Content も削除

#### ✅ フロントエンド（React）に置くもの

- UI/UX
- フォームバリデーション（クライアント側、UX向上目的）
- API呼び出し（fetch / SWR / React Query等）
- **リアルタイム購読のみSupabase直接**
  - Supabase の Realtime 機能を直接使用
  - 購読（subscribe）のみフロントから直接、データ更新はAPI経由

### 開発ルール

#### マイグレーションファイル

1. **命名規則**：`YYYYMMDDHHMMSS_説明.sql`
2. **1 ファイル 1 責務**：テーブル単位、機能単位で分割
3. **必ずロールバック（down）を書く**
4. **コメント必須**：設計意図を明記
5. **トリガー・関数は最小限**：updated_at、認証連携のみ

#### API Routes

1. **RESTful 命名**：`/api/seasons`, `/api/seasons/[id]`
2. **HTTP メソッド準拠**：GET, POST, PATCH, DELETE
3. **エラーハンドリング必須**
4. **バリデーション必須**（Zod）
5. **レスポンス形式統一**：`{ data, error }`

#### リアルタイム

1. **購読はフロントエンドから直接**
2. **カスタムフック化**：`useRealtime〇〇`
3. **必要なテーブルのみ有効化**
4. **RLS で購読権限を制御**

## 開発フロー

### Phase 1-1: 基盤構築（現在）

- [x] 技術選定
- [ ] DB スキーマ設計
  - [ ] users（完了）
  - [ ] seasons
  - [ ] contents
  - [ ] tags
  - [ ] season_editors（共有編集）
- [ ] マイグレーション実行・検証
- [ ] Next.js API Routes 基盤構築

### Phase 1-2: 認証・ユーザー管理

- [ ] Google 認証実装
- [ ] ユーザープロフィール表示・編集
- [ ] テーマ切り替え（ライト・ダーク）
- [ ] アカウント削除

### Phase 1-3: Season CRUD

- [ ] Season 作成・一覧
- [ ] Season 詳細・編集・削除
- [ ] Season 切り替え

### Phase 1-4: Content CRUD

- [ ] Content 作成（手動入力）
- [ ] Content 一覧・詳細
- [ ] Content 編集・削除
- [ ] タグ管理

### Phase 1-5: グリッド表示・並び替え

- [ ] 曜日別グリッド表示
- [ ] ドラッグ&ドロップ並び替え
- [ ] 曜日自動カラーリング

### Phase 1-6: 共有編集・リアルタイム

- [ ] 共有編集機能（オーナー + エディター）
- [ ] リアルタイム同期
- [ ] オンラインユーザー表示

### Phase 1-7: デプロイ・テスト

- [ ] Vercel デプロイ
- [ ] E2E テスト
- [ ] ユーザーテスト

# supabase 環境構築

## 初期構築

（すでに完了済み、再実行不要）
プロジェクトルートのディレクトリにて

```
npm init -y
npm install supabase --save-dev
npx supabasae init
```

## supabase コマンド

```
# 起動
npx supabase start

# 停止（データは保持される）
npx supabase stop

# 停止 + データも削除（完全リセット）
npx supabase stop --no-backup

# 状態確認
npx supabase status

# データベースのリセット（コンテナは起動したまま）
npm run db:reset
```

### データベース定義周り

```
# タイムスタンプ付きでマイグレーションファイルを自動生成
supabase migration new <マイグレーション名>

# 例
supabase migration new create_users_table
# → supabase/migrations/20241216120000_create_users_table.sql

```

# フロントエンド開発環境

## 前提条件

- Node.js 24 以上
- 推奨: [fnm](https://github.com/Schniz/fnm) でバージョン管理

## fnm セットアップ（Windows PowerShell）

### インストール

```powershell
# wingetでインストール（推奨）
winget install Schniz.fnm

# または scoop
scoop install fnm
```

### シェル設定

PowerShell プロファイルに追加（一度だけ）:

```powershell
# プロファイルを開く
notepad $PROFILE

# 以下を追記して保存
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

PowerShell を再起動。

### 基本コマンド

```powershell
# Node.js インストール
fnm install 24          # v24系の最新
fnm install --lts       # 最新LTS

# インストール済み一覧
fnm list

# バージョン切り替え（手動）
fnm use 24

# デフォルトバージョン設定
fnm default 24

# 現在のバージョン確認
node -v
```

### 自動切り替え

シェル設定で `--use-on-cd` を有効にしていれば、`.node-version` ファイルがあるディレクトリに `cd` すると自動で切り替わります。

```powershell
# プロジェクトルートに移動すると自動でv24.13.0に切り替わる
cd show-spark
node -v  # → v24.13.0
```

## フロントエンド起動

```powershell
# ターミナル1: Supabase起動
npx supabase start

# ターミナル2: フロントエンド起動
cd frontend
npm install   # 初回のみ
npm run dev
```

## 環境変数

`frontend/.env.local` を作成:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<supabase statusで表示されるanon key>
```

※ `npx supabase status` で表示される値を使用
