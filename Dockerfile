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

CMD ["npm", "run", "start"]
