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
npx supabase migration new <マイグレーション名>

# 例
npx supabase migration new create_users_table
# → supabase/migrations/20241216120000_create_users_table.sql

```

### devにデプロイ（手動）

develop, mainブランチにマージで自動プッシュされるが、手動でもできる

プロジェクトrefはsupabaseプロジェクトページのリンクの中にある
`https://supabase.com/dashboard/project/{ここがプロジェクトref}`

```
# 1. ログイン
npx supabase login

# 2. プロジェクトref設定
npx supabase link --project-ref {プロジェクトref}

# 3. 開発環境にデプロイ
npx supabase db push
```

## 環境変数確認方法（後で書く）

**SUPABASE_ACCESS_TOKEN**
個人設定から取得できる
DBごとではなく、アカウント単位で存在（DB間で共通）

右上のアイコン -> account preferences -> Access Tokens
で、必要だったら作成する

**SUPABASE_DB_PASSWORD**
Database -> settings
パスワードは一度忘れたら再設定が必要
`reset database password` ボタン


**SUPABASE_PROJECT_ID**

settings -> general -> general settings -> project ID



**SUPABASE_DB_URL**

DBのダッシュボードヘッダーにある `Connect` ボタンクリック
出てくるダイアログのDirect connectionのURL

passwordは先程のDB passwordに置き換える

## seedファイルの構成

```
supabase/seeds/
├── local/   # ローカル開発用のみ（db:reset 時に適用）
│   ├── 01_auth_users.sql
│   └── 02_users.sql
└── master/  # システム固定データ（dev/prodにも自動適用）
    └── 01_themes.sql
```

`master/` 配下のファイルは develop/main へのマージのたびに自動で上書きUPSERTされる。
固定値テーブル（themes等）はここで管理する。