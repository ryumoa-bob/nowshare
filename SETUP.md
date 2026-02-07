# NowShare - Be Real風 Webアプリ

「今の瞬間を共有する」SNSアプリ。

## 機能

- ✅ ユーザー登録・ログイン（Firebase Auth）
- ✅ 「今何してる？」投稿（テキスト＋写真）
- ✅ 友人一覧
- ✅ タイムライン
- ✅ 24時間で自動削除
- ✅ リアクション（❤️🔥😂）

## 技術スタック

### フロントエンド
- **React 18** + Vite
- **Material-UI (MUI)**
- **React Router**
- **Axios**

### バックエンド
- **Node.js** + **Express**
- **MongoDB Atlas**（無料枠512MB）

### インフラ
- **Vercel**（フロントエンド）
- **Render**（バックエンド）
- **Firebase**（認証・ストレージ）

---

## 開発環境セットアップ

### 1. 前提条件

- Node.js 18以上
- npm または yarn
- MongoDB Atlasアカウント（無料）
- Firebaseプロジェクト（認証・ストレージ有効化）

### 2. バックエンドセットアップ

```bash
cd backend

# パッケージインストール
npm install

# 環境変数設定
cp .env.example .env
# .envファイルを編集：
# - MONGODB_URI：MongoDB Atlasの接続文字列
# - PORT：3000（デフォルト）
```

**.env.example**
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nowshare
PORT=3000
```

```bash
# サーバー起動（開発モード）
npm run dev
```

### 3. フロントエンドセットアップ

```bash
cd frontend

# パッケージインストール
npm install

# 開発サーバー起動
npm run dev
```

### 4. 動作確認

- フロント：http://localhost:5173
- バック：http://localhost:3000/api/health

---

## 本番デプロイ

### バックエンド（Render）

1. GitHubにコードをプッシュ
2. Renderで新規Web Service作成
3. Build Command: `npm install`
4. Start Command: `npm start`
5. 環境変数にMONGODB_URIを設定

### フロントエンド（Vercel）

1. VercelでGitHubリポジトリをインポート
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. 環境変数設定（必要に応じて）

### Firebase設定

1. Firebase Consoleでプロジェクト作成
2. Authentication有効化（Googleログイン）
3. Storage有効化
4. 設定情報を控えめに

---

## API仕様

### ユーザー

| Method | Endpoint | 说明 |
|--------|----------|------|
| POST | /api/users/upsert | ユーザー作成・更新 |
| GET | /api/users/:uid | ユーザー情報取得 |
| POST | /api/users/:uid/friends | 友人追加 |
| GET | /api/users/:uid/friends | 友人一覧取得 |

### 投稿

| Method | Endpoint | 说明 |
|--------|----------|------|
| GET | /api/posts | 全投稿取得（タイムライン） |
| GET | /api/posts/user/:uid | ユーザーの投稿取得 |
| POST | /api/posts | 新規投稿作成 |
| POST | /api/posts/:id/reaction | リアクション追加 |
| DELETE | /api/posts/:id | 投稿削除 |

---

## 今後の拡張アイデア

- 🔔 プッシュ通知
- 🗺️ 位置情報共有
- 🎥 ビデオ投稿
- 👥 グループ機能
- 🔍 検索機能
- 📊 分析ダッシュボード

---

## ライセンス

MIT

---

## 作者

Created with ❤️ by Clawdy
