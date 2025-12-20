# Frontend - Show Spark

アニメスケジュール管理ツールのフロントエンド（Next.js 15 + TypeScript）

docker 起動コマンド

```bash
docker build -t syncspire-frontend .

# Windows
docker run -it -p 3000:3000 -v ${PWD}:/app --name syncspire-frontend --rm syncspire-frontend
# Mac
docker run -it -p 3000:3000 -v $(pwd):/app --name syncspire-frontend --rm syncspire-frontend
```
