// Firebase設定（デモ用 - 実際の設定はFirebase Consoleから取得）

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase設定（この値はFirebase Consoleから取得して置き換えてください）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// 認証
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ストレージ
export const storage = getStorage(app);

export default app;
