# NowShare - 本番デプロイガイド

## 🚀 クイックデプロイ（Vercel + Render）

### 前提条件

- GitHubアカウント
- Vercelアカウント
- Renderアカウント
- MongoDB Atlasクラスター（オプション）
- Firebaseプロジェクト（オプション）

---

## 🎨 フロントエンドデプロイ（Vercel）

### 方法1：GitHub経由で自動デプロイ（推奨）

1. **GitHubにアップロード**

```bash
cd /home/ec2-user/.openclaw/workspace/nowshare
git init
git add .
git commit -m "NowShare - Be Real風 Webアプリ"
git remote add origin https://github.com/あなたのユーザー名/nowshare.git
git push -u origin main
```

2. **Vercelでインポート**

1. https://vercel.com にアクセス
2. 「Add New Project」をクリック
3. 「Import Git Repository」でGitHubリポジトリを選択
4. 設定:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 「Deploy」をクリック

6. 環境変数（オプション）:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

### 方法2：CLIでデプロイ

```bash
# Vercol CLIインストール
npm i -g vercel

# ログイン
vercel login

# プロジェクト設定
cd frontend
vercel

# 本番デプロイ
vercel --prod
```

### Vercel URL例
```
https://nowshare-xxx.vercel.app
```

---

## 🔧 バックエンドデプロイ（Render）

### 1. GitHubにバックエンドをアップロード

```bash
cd backend
git init
git add .
git commit -m "NowShare Backend"
git remote add origin https://github.com/あなたのユーザー名/nowshare-backend.git
git push -u origin main
```

### 2. RenderでWeb Service作成

1. https://dashboard.render.com にアクセス
2. 「New +」→「Web Service」をクリック
3. 「Connect GitHub Repository」で選択
4. 設定:
   - Name: `nowshare-api`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: `Free`

5. 環境変数:
   ```
   MONGODB_URI=mongodb+srv://...
   PORT=3000
   ```

6. 「Create Web Service」をクリック

### Render URL例
```
https://nowshare-api.onrender.com
```

---

## 🗄️ MongoDB Atlas接続（本番用）

### 1. MongoDB Atlasでクラスター作成

1. https://cloud.mongodb.com にアクセス
2. 「Create Cluster」
3. M0 Free選択
4. Tokyoリージョン選択
5. 作成完了まで5-10分待機

### 2. 接続文字列取得

1. 「Database」→「Clusters」をクリック
2. 「Connect」→「Connect your application」
3. 接続文字列をコピー:
   ```
   mongodb+srv://<username>:<password>@nowshare-cluster.xxxxx.mongodb.net/nowshare?retryWrites=true&w=majority
   ```

### 3. Renderに設定

Render → Your Service → Environment Variablesに追加:
```
MONGODB_URI=mongodb+srv://admin:password@cluster.xxxxx.mongodb.net/nowshare?retryWrites=true&w=majority
```

---

## 🔐 Firebase連携（本番用）

### 1. Firebase Consoleで設定

1. https://console.firebase.google.com にアクセス
2. プロジェクト作成
3. Authentication有効化（Google）
4. Storage有効化

### 2. 設定情報コピー

プロジェクト設定→マイアプリ→Web→設定を取得

### 3. フロントエンドに設定

Vercel → Your Project → Environment Variables:
```
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 📱 API URL更新

### バックエンドURLが変わったら

1. バックエンドをRenderにデプロイ
2. URLを確認（例: `https://nowshare-api.onrender.com`）
3. フロントエンドの `frontend/.env.production` を作成:
   ```
   REACT_APP_API_URL=https://nowshare-api.onrender.com/api
   ```
4. Gitにpush→Vercelが自動再デプロイ

---

## 🧪 本番環境テスト

```bash
# APIテスト
curl https://your-backend.onrender.com/api/health

# タイムライン取得
curl https://your-backend.onrender.com/api/posts

# 投稿作成
curl -X POST https://your-backend.onrender.com/api/posts \
  -H "Content-Type: application/json" \
  -d '{"uid":"test","text":"本番テスト"}'
```

---

## 🔄 更新デプロイ

### フロントエンド更新

```bash
cd frontend
git add .
git commit -m "Update"
git push
# Vercelが自動デプロイ
```

### バックエンド更新

```bash
cd backend
git add .
git commit -m "Update"
git push
# Renderが自動デプロイ
```

---

## 💰 本番環境費用

| サービス | 無料枠 | 月額費用 |
|----------|--------|----------|
| Vercel | 無制限 | ¥0 |
| Render | 750時間/月 | ¥0 |
| MongoDB Atlas | 512MB | ¥0 |
| Firebase | 1GB Storage | ¥0 |

**合計: ¥0/月**

---

## 📞 トラブルシューティング

### バックエンドが起動しない

```
1. Render Logsを確認
2. MONGODB_URIが正しいか確認
3. ポートが3000か確認
```

### CORSエラー

```
1. backend/server.js でCORS設定を確認
2. 本番URLを許可に追加
```

### 画像がアップロードできない

```
1. Firebase Storageルールを確認
2. Firebase設定が正しいか確認
```

---

## 🎯 完成後のURL

| サービス | URL |
|----------|-----|
| フロントエンド | https://nowshare-xxx.vercel.app |
| バックエンド | https://nowshare-api.onrender.com |
| API | https://nowshare-api.onrender.com/api |

---

## 📚 参考リンク

- Vercel: https://vercel.com
- Render: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Firebase: https://console.firebase.google.com

---

Made with ❤️ by Clawdy
