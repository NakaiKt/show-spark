# Frontend - Show Spark

アニメスケジュール管理ツールのフロントエンド（Next.js 15 + TypeScript）

docker 起動コマンド

```bash
docker build -t showspark .

# Windows
docker run -it -p 3000:3000 -v ${PWD}:/app --name showspark --rm showspark
# Mac
docker run -it -p 3000:3000 -v $(pwd):/app --name showspark --rm showspark
```
