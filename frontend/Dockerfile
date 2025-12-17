# ==============================
# 開発環境用 Dockerfile
# ==============================
# ホットリロード対応、変更が即座に反映される開発環境
# 本番環境用は Dockerfile.prod を別途作成予定

FROM node:20-alpine AS base

# 作業ディレクトリ
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係インストール
RUN npm ci

# アプリケーションのソースコードをコピー
# 注意: docker-compose.yml で volume マウントするため、
# 実行時はホストのファイルが優先される
COPY . .

# 開発サーバーのポートを公開
EXPOSE 3000

# 開発サーバー起動
# --turbopack: Next.js 15 の高速ビルドツール（オプション）
CMD ["npm", "run", "dev"]
