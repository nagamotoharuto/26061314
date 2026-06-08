FROM node:20-alpine

WORKDIR /app

# 依存関係インストール (prisma generate は postinstall で実行される)
COPY apps/web/package*.json ./
COPY apps/web/prisma ./prisma
RUN npm ci

# ソースコードをコピーしてビルド
COPY apps/web/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# 起動時に DB マイグレーション → アプリ起動
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts && npm run start"]
