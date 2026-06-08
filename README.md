# 三条市立大学 学園祭マップ

学園祭来場者向けのインタラクティブ校内マップアプリ。

## ローカル起動手順

```bash
cd apps/web
cp ../../.env.example .env
# .env の DATABASE_URL / SESSION_SECRET / STAFF_PASSWORD を編集

npm install
npm run db:push
npm run db:seed
npm run dev
```

PostgreSQL が必要です。Docker を使う場合:

```bash
docker compose up -d   # プロジェクトルートで実行
```

## Railway デプロイ

1. Railway でプロジェクト作成 → PostgreSQL プラグイン追加
2. `DATABASE_URL` / `SESSION_SECRET` / `STAFF_PASSWORD` を環境変数に設定
3. Build コマンド: `npm run build`
4. Start コマンド: `npm run start`
5. 初回デプロイ後に `npm run db:push && npm run db:seed` を Railway のシェルで実行

## スタッフ管理画面

- URL: `/staff/login`
- パスワード: `.env` の `STAFF_PASSWORD` の値

## ピン位置の調整

スタッフ管理画面 → 各部屋の「ピン位置を設定」ボタン → フロアマップ上をクリックして位置を指定
