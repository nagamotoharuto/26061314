# 三条市立大学 学園祭マップ (CLAUDE.md)

このファイルは Claude Code がプロジェクト全体で参照する**最上位の設計思想・規約**を定義する。
新しい機能追加・リファクタ・デバッグの**全ての判断は、この文書を最優先**とする。

---

## 0. このプロジェクトの前提

- **主たる成果物**: 学園祭向け校内マップWebアプリ (Next.js)
- **用途**: タッチスクリーン式デジタルサイネージ。一般来場者がフロアマップを見て各教室のイベント情報を確認する
- **スタッフ機能**: パスワード認証付き管理画面でイベント情報・ピン位置を編集
- **デプロイ先**: Railway (初期) / AWS (本番拡張時)
- **将来的な展開**: 同一APIをiOS/Androidアプリから呼び出せる構造を初日から確保

---

## 1. 設計思想 (Core Philosophy)

### 1.1 API-First / プラットフォーム非依存

- ビジネスロジックは**必ず HTTP API (REST)** の背後に置く
- 認証・認可・データ整合性は**サーバー側で完結**させる

### 1.2 型安全 (Type Safety) を最優先

- 全てのコードは **TypeScript** で書く
- `any` は原則禁止

### 1.3 環境差異の局所化

- `process.env` の参照は **`src/lib/env.ts` に集約**
- DBパスワード等は**コード内にハードコードしない**

### 1.4 状態は1箇所、データは1箇所

- データの真実は**サーバーDB**
- `localStorage` に業務データを保存しない

### 1.5 AIっぽさを出さない

- 絵文字を使わない
- 余白・タイポグラフィ・コントラストで質を出す

---

## 2. 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript
- **UIライブラリ**: shadcn/ui (Tailwind CSS ベース)
- **状態管理**: TanStack Query + React useState
- **フォーム**: React Hook Form + Zod
- **アイコン**: lucide-react
- **バックエンド**: Next.js API Routes
- **ORM**: Prisma
- **DB**: PostgreSQL
- **認証**: iron-session (単一スタッフパスワード)
- **フォント**: Noto Sans JP

---

## 3. プロジェクト構造

```
apps/web/
├── prisma/schema.prisma
├── public/images/
│   ├── floors/ (floor-1.png ~ floor-4.png)
│   └── rooms/  (各教室画像)
└── src/
    ├── app/
    │   ├── api/         # REST API Routes
    │   ├── floor/[floorId]/ # フロアマップ表示
    │   ├── staff/       # スタッフ管理画面
    │   └── page.tsx     # フロア選択ホーム
    ├── components/
    │   ├── ui/          # shadcn/ui コンポーネント
    │   └── features/    # 機能単位コンポーネント
    ├── lib/             # env.ts, db.ts, auth.ts, utils.ts
    └── server/          # services/, repositories/
```

---

## 4. データモデル

- **Room**: 教室情報 (名前, 階数, ピン位置X/Y%)
- **Event**: イベント情報 (タイトル, 内容, 開始日時, 終了日時)
- 1 Room : 0~1 Event (学園祭期間中は各部屋に最大1つのイベント)

---

## 5. セキュリティ最低ライン

1. `.env` を git に commit しない
2. スタッフパスワードをコードにハードコードしない (env変数)
3. ユーザー入力は全て Zod でバリデーション
4. SQLインジェクション対策: Prisma 経由のみ
5. XSS対策: dangerouslySetInnerHTML を使わない
