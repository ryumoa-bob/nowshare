// API通信サービス

import axios from 'axios';

// APIベースURL（環境変数から取得、またはデフォルト）
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Axiosインスタンス作成
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（必要に応じて認証トークン追加）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポン interceptor（エラー処理）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============ Users API ============

// ユーザー作成・更新
export const upsertUser = async (userData) => {
  const res = await api.post('/users/upsert', userData);
  return res.data;
};

// ユーザー情報取得
export const getUser = async (uid) => {
  const res = await api.get(`/users/${uid}`);
  return res.data;
};

// 友人一覧取得
export const getFriends = async (uid) => {
  const res = await api.get(`/users/${uid}/friends`);
  return res.data;
};

// 友人追加
export const addFriend = async (uid, friendUid) => {
  const res = await api.post(`/users/${uid}/friends`, { friendUid });
  return res.data;
};

// ============ Posts API ============

// 全投稿取得（タイムライン）
export const getPosts = async () => {
  const res = await api.get('/posts');
  return res.data;
};

// ユーザーの投稿取得
export const getUserPosts = async (uid) => {
  const res = await api.get(`/posts/user/${uid}`);
  return res.data;
};

// 新規投稿作成
export const createPost = async (postData) => {
  const res = await api.post('/posts', postData);
  return res.data;
};

// リアクション追加
export const addReaction = async (postId, reactionType) => {
  const res = await api.post(`/posts/${postId}/reaction`, { reactionType });
  return res.data;
};

// 投稿削除
export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

// ============ Auth API ============

// デモ用：ローカル認証
export const demoLogin = async () => {
  const demoUser = {
    uid: 'demo-user-' + Date.now(),
    displayName: 'デモユーザー',
    email: 'demo@example.com',
    photoURL: '',
  };
  localStorage.setItem('authToken', demoUser.uid);
  localStorage.setItem('user', JSON.stringify(demoUser));
  return demoUser;
};

// ログアウト
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export default api;
