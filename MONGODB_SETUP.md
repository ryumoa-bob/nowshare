# NowShare - MongoDB Atlas セットアップ

## 📋 手順

### 1. MongoDB Atlasアカウント作成

1. https://cloud.mongodb.com にアクセス
2. 「Sign Up」でアカウント作成
3. Googleアカウントでサインイン推奨

### 2. クラスター作成

1. 「Create Cluster」をクリック
2. **M0 Free** を選択（永久無料）
3. 地域は **Tokyo** または **Singapore** を選択
4. クラスター名: `NowShare-Cluster`
5. 「Create Cluster」をクリック

### 3. データベースユーザー作成

1. 左メニュー「Database Access」をクリック
2. 「Add New Database User」をクリック
3. 設定:
   - Username: `nowshare_admin`
   - Password: `任意のパスワード`（控えておく）
   - Built-in Role: `Atlas admin`
4. 「Add User」をクリック

### 4. ネットワークアクセス設定

1. 左メニュー「Network Access」をクリック
2. 「Add IP Address」をクリック
3. 「Allow Access from Anywhere」を選択
4. 「0.0.0.0/0」を確認
5. 「Confirm」をクリック

### 5. クラスターに接続

1. 「Database」→「Clusters」をクリック
2. 「Connect」→「Connect your application」をクリック
3. 接続文字列をコピー:
   ```
   mongodb+srv://nowshare_admin:<password>@nowshare-cluster.xxxxx.mongodb.net/nowshare?retryWrites=true&w=majority
   ```

### 6. バックエンドに設定

```bash
cd /home/ec2-user/.openclaw/workspace/nowshare/backend
cp .env.example .env
```

`.env`ファイルを編集:
```
MONGODB_URI=mongodb+srv://nowshare_admin:あなたのパスワード@nowshare-cluster.xxxxx.mongodb.net/nowshare?retryWrites=true&w=majority
PORT=3000
```

### 7. テスト実行

```bash
cd /home/ec2-user/.openclaw/workspace/nowshare/backend
npm start
```

成功すれば:
```
✅ MongoDB接続成功
🚀 NowShare API Server running on port 3000
```

---

## 🎯 接続確認用curl

```bash
# ヘルスチェック
curl http://localhost:3000/api/health

# 投稿作成
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"uid":"test-user","text":"MongoDBテスト投稿"}'
```

---

## 📝 トラブルシューティング

| エラー | 解決方法 |
|--------|----------|
| `ENOTFOUND` | ネットワークアクセスで0.0.0.0/0を追加 |
| `Authentication failed` | ユーザー名・パスワードを確認 |
| `Timeout` | クラスターが作成中인지確認 |

---

## 📚 参考リンク

- MongoDB Atlas: https://cloud.mongodb.com
- ドキュメント: https://docs.atlas.mongodb.com/
