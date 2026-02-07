# NowShare - Firebase セットアップ

## 📋 手順

### 1. Firebaseプロジェクト作成

1. https://console.firebase.google.com にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `NowShare`
4. Google Analytics: 「無効」にして作成
5. 作成完了まで待つ

### 2. Authentication設定

1. 左メニュー「Authentication」をクリック
2. 「始める」をクリック
3. 「Sign-in method」タブ
4. 「Google」を有効化:
   - 「メール/パスワード」は無効のまま
   - 「Google」のみでOK
5. メール設定:
   - プロジェクトサポートメール: 自分のGmailを選択
6. 保存

### 3. Storage設定

1. 左メニュー「Storage」をクリック
2. 「始める」をクリック
3. セキュリティルール:
   - テストモードで開始（誰からでも読み書き可能）
   - 本番ではルールを変更
4. ロケーション: `asia-northeast1` (Tokyo)
5. 「完了」をクリック

### 4. 設定情報取得

1. 左メニュー「プロジェクト概要」の横にある⚙️アイコン
2. 「プロジェクト設定」をクリック
3. 下の方「マイアプリ」セクション
4. 「</>」(Web)をクリック
5. アプリニックネーム: `NowShare-Web`
6. 「アプリ 등록」をクリック
7. `firebaseConfig` オブジェクトをコピー:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "nowshare.firebaseapp.com",
     projectId: "nowshare",
     storageBucket: "nowshare.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### 5. フロントエンドに設定

`/home/ec2-user/.openclaw/workspace/nowshare/frontend/src/services/firebase.js` を編集:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ここで自分の設定に書き換える
const firebaseConfig = {
  apiKey: "AIzaSyB...",      // 自分のAPI Key
  authDomain: "nowshare.firebaseapp.com",
  projectId: "nowshare",
  storageBucket: "nowshare.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;
```

---

## 🎯 機能別設定

### Googleログイン

```javascript
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

// ログイン
const login = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // ユーザー情報をサーバーに保存
    await fetch('/api/users/upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      })
    });
    return user;
  } catch (error) {
    console.error('Login error:', error);
  }
};

// ログアウト
const logout = async () => {
  await signOut(auth);
};
```

### 画像アップロード

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

const uploadImage = async (file) => {
  try {
    // ストレージ参照作成
    const storageRef = ref(storage, `posts/${uuidv4()}-${file.name}`);
    
    // アップロード
    const snapshot = await uploadBytes(storageRef, file);
    
    // ダウンロードURL取得
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

---

## 📦 必要なパッケージインストール

```bash
cd /home/ec2-user/.openclaw/workspace/nowshare/frontend
npm install firebase uuid
```

---

## 🔒 本番用のセキュリティルール

Firebase Console → Storage → Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 認証済みユーザーのみ読み書き可能
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024  // 5MB以下
                   && request.resource.contentType.matches('image/.*');
    }
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📚 参考リンク

- Firebase Console: https://console.firebase.google.com
- Authentication Docs: https://firebase.google.com/docs/auth
- Storage Docs: https://firebase.google.com/docs/storage

---

## 🎯 テスト用curl

```bash
# ヘルスチェック
curl http://localhost:3000/api/health

# 投稿作成（画像なし）
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"uid":"demo-user","text":"Firebase連携テスト"}
```

---

## ✅ 設定完了チェックリスト

- [ ] Firebaseプロジェクト作成
- [ ] Authentication有効化（Google）
- [ ] Storage有効化
- [ ] 設定情報コピー
- [ ] firebase.js更新
- [ ] 動作確認（ログイン）
- [ ] 画像アップロードテスト
