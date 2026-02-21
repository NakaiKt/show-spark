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
# 1. プロファイルファイルを作成
New-Item -Path $PROFILE -Type File -Force

# 2. notepadで開く
notepad $PROFILE

# 3. 以下を追記して保存
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression

# 4. PowerShellを再起動

```

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

## ローカル開発でのメール確認

ローカル環境のメールは **Inbucket**（ローカルのメールキャッチャー）を使用

Magic Link 等の認証メールを確認するには：

```
http://localhost:54324
```
