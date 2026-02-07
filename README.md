# NowShare - Be Real風 Webアプリ

「今の瞬間を共有する」SNSアプリ。

## 🎯 アプリの特徴

| 機能 | 说明 |
|------|------|
| 📸 今何してる？投稿 | テキスト＋写真で「今」を共有 |
| 👥 友人機能 | 友人を追加・一覧表示 |
| 💬 リアクション | ❤️🔥😂で反応できる |
| ⏰ 24時間で自動削除 | Be Real처럼時間が経つと消える |
| 🎨 美しいUI | Material-UIでシンプルに |

## 🚀 クイックスタート

### 方法1：デモモード（即座に試せる）

```bash
# バックエンド起動
cd backend && npm start

# 新しいターミナルでフロントエンド起動
cd frontend && npm run dev

# ブラウザでアクセス
# http://localhost:5173
# 「🚀 デモモードで始める」クリックでOK
```

### 方法2：テスト実行

```bash
# 自動テスト
./test.sh

# 手動テスト
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/test/seed
curl http://localhost:3000/api/posts
```

## 📁 プロジェクト構成

```
nowshare/
├── frontend/                  # React + Vite フロントエンド
│   ├── src/
│   │   ├── App.jsx           # メインアプリ
│   │   ├── main.jsx          # エントリーポイント
│   │   ├── hooks/
│   │   │   └── useAuth.jsx   # 認証Hook
│   │   ├── services/
│   │   │   ├── api.js        # API通信サービス
│   │   │   └── firebase.js   # Firebase設定
│   │   ├── components/
│   │   │   └── Header.jsx    # ヘッダー
│   │   └── pages/
│   │       ├── Timeline.jsx   # タイムライン
│   │       ├── PostForm.jsx   # 投稿ページ
│   │       ├── Login.jsx      # ログインページ
│   │       └── Profile.jsx    # プロフィールページ
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express バックエンド
│   ├── server.js              # APIサーバー（モックモード付き）
│   ├── routes/
│   │   ├── users.js          # ユーザーAPI
│   │   └── posts.js          # 投稿API
│   ├── models/
│   │   ├── User.js           # ユーザーモデル
│   │   └── Post.js           # 投稿モデル
│   ├── .env.example
│   └── package.json
│
├── nowshare-files/             # 個別ファイル保存
│   ├── index.html             # ブラウザで確認できるファイル一覧
│   └── *.md                   # 各ファイルの内容
│
├── test.sh                     # 自動テストスクリプト
├── README.md                   # このファイル
├── SETUP.md                    # セットアップ手順
├── DEVELOPMENT.md              # 開発記録
├── MONGODB_SETUP.md            # MongoDB Atlas設定
└── FIREBASE_SETUP.md           # Firebase設定
```

## 📚 セットアップガイド

### 1. デモモード（即座に試せる）

```bash
# バックエンド
cd backend && npm start

# フロントエンド
cd frontend && npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### 2. MongoDB Atlas連携（オプション）

[MONGODB_SETUP.md](./MONGODB_SETUP.md) を参照

### 3. Firebase連携（オプション）

[FIREBASE_SETUP.md](./FIREBASE_SETUP.md) を参照

## 🎮 機能一覧

### 必須機能 ✅

- [x] ユーザー登録・ログイン（デモモード）
- [x] 「今何してる？」投稿（テキストのみ）
- [x] 友人追加・一覧
- [x] タイムライン表示
- [x] リアクション（❤️🔥😂）
- [x] 24時間で自動削除
- [x] デモログインモード
- [x] 画像プレビュー

### 今後の拡張 🚧

- [ ] Googleログイン（Firebase Auth）
- [ ] 画像アップロード（Firebase Storage）
- [ ] プッシュ通知
- [ ] 位置情報共有
- [ ] ビデオ投稿

## 🧪 テスト結果

```
✅ Health Check           - OK
✅ データリセット         - OK
✅ Seedデータ作成         - OK (5件)
✅ 投稿一覧取得          - OK (5件)
✅ 新規投稿作成           - OK
✅ リアクション追加       - OK
✅ ユーザー作成          - OK
✅ ユーザー取得          - OK
✅ デバッグ情報取得       - OK

🎉 全テスト合格！
```

## 💰 初期費用

**¥0** - すべて無料ツールで構成

| ツール | 料金 |
|--------|------|
| React + Vite | 無料 |
| Node.js + Express | 無料 |
| MongoDB Atlas | 512MBまで無料 |
| Firebase Auth | 無料 |
| Firebase Storage | 1GBまで無料 |
| Vercel | 無料 |
| Render | 無料 |

## 📅 開発期間

| フェーズ | 内容 | ステータス |
|----------|------|----------|
| 要件定義 | 要件洗い出し | ✅ 完了 |
| 環境構築 | React + Node.js | ✅ 完了 |
| バックエンド | API設計・実装 | ✅ 完了 |
| データベース | MongoDBモデル | ✅ 完了 |
| フロントエンド | UI作成 | ✅ 完了 |
| テスト | 自動テスト作成 | ✅ 完了 |
| MongoDB連携 | Atlas設定 | 📖 手順書あり |
| Firebase連携 | Auth+Storage | 📖 手順書あり |

## 🌐 APIリファレンス

| Method | Endpoint | 说明 |
|--------|----------|------|
| GET | /api/health | ヘルスチェック |
| GET | /api/test | テストエンドポイント |
| GET | /api/users | 全ユーザー取得 |
| POST | /api/users/upsert | ユーザー作成・更新 |
| GET | /api/users/:uid | ユーザー情報取得 |
| POST | /api/users/:uid/friends | 友人追加 |
| GET | /api/users/:uid/friends | 友人一覧取得 |
| GET | /api/posts | 全投稿取得（タイムライン） |
| GET | /api/posts/user/:uid | ユーザーの投稿取得 |
| POST | /api/posts | 新規投稿作成 |
| POST | /api/posts/:id/reaction | リアクション追加 |
| DELETE | /api/posts/:id | 投稿削除 |
| POST | /api/test/reset | データリセット |
| POST | /api/test/seed | テストデータ作成 |
| GET | /api/test/debug | デバッグ情報 |

## 🔧 トラブルシューティング

### バックエンドが起動しない

```bash
cd backend
npm start
```

### フロントエンドが起動しない

```bash
cd frontend
npm run dev
```

### MongoDB接続エラー

[MONGODB_SETUP.md](./MONGODB_SETUP.md) を参照

### Firebase連携エラー

[FIREBASE_SETUP.md](./FIREBASE_SETUP.md) を参照

## 📞 連絡先

Questions? Issueを作成してください！

---

Made with ❤️ by Clawdy

📸 **NowShare** - Be Real風 Webアプリ
