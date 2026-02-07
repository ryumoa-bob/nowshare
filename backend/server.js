// NowShare バックエンドサーバー（モックモード付き）

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ミドルウェア
app.use(cors());
app.use(express.json());

// ============ モックデータベース ============
const mockUsers = new Map();
const mockPosts = [];

// デモユーザー作成
mockUsers.set('demo-user', {
  uid: 'demo-user',
  displayName: 'デモユーザー',
  email: 'demo@example.com',
  photoURL: '',
  friends: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

// ============ APIルート ============

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'NowShare API Server Running',
    mode: 'mock'
  });
});

// テスト用ルート
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'NowShare API Test Successful',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: 'mock'
  });
});

// ============ ユーザールート ============

// 全ユーザー取得
app.get('/api/users', (req, res) => {
  const users = Array.from(mockUsers.values()).map(u => ({
    ...u,
    email: undefined  // メールアドレスは隠す
  }));
  res.json(users);
});

// ユーザー作成・更新
app.post('/api/users/upsert', (req, res) => {
  const { uid, displayName, email, photoURL } = req.body;
  
  let user = mockUsers.get(uid);
  
  if (user) {
    user.displayName = displayName;
    user.email = email;
    user.photoURL = photoURL;
    user.updatedAt = new Date();
    res.json({ message: 'User updated', user });
  } else {
    user = { uid, displayName, email, photoURL, friends: [], createdAt: new Date(), updatedAt: new Date() };
    mockUsers.set(uid, user);
    res.status(201).json({ message: 'User created', user });
  }
});

// ユーザー情報取得
app.get('/api/users/:uid', (req, res) => {
  const user = mockUsers.get(req.params.uid);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ ...user, email: undefined });
});

// 友人追加
app.post('/api/users/:uid/friends', (req, res) => {
  const { friendUid } = req.body;
  const user = mockUsers.get(req.params.uid);
  const friend = mockUsers.get(friendUid);
  
  if (!user || !friend) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (!user.friends.includes(friendUid)) {
    user.friends.push(friendUid);
  }
  
  res.json({ message: 'Friend added', user: { ...user, email: undefined } });
});

// 友人一覧取得
app.get('/api/users/:uid/friends', (req, res) => {
  const user = mockUsers.get(req.params.uid);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const friends = user.friends.map(fuid => {
    const f = mockUsers.get(fuid);
    return f ? { uid: f.uid, displayName: f.displayName, photoURL: f.photoURL } : null;
  }).filter(Boolean);
  
  res.json(friends);
});

// ============ 投稿ルート ============

// 全投稿取得（タイムライン）- 24時間以内
app.get('/api/posts', (req, res) => {
  const now = new Date();
  const cutoff = new Date(now - 24 * 60 * 60 * 1000);
  
  const validPosts = mockPosts
    .filter(p => new Date(p.createdAt) >= cutoff)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(validPosts);
});

// ユーザーの投稿取得
app.get('/api/posts/user/:uid', (req, res) => {
  const user = mockUsers.get(req.params.uid);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userPosts = mockPosts
    .filter(p => p.userId === req.params.uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(userPosts);
});

// 新規投稿作成
app.post('/api/posts', (req, res) => {
  const { uid, text, imageURL, location } = req.body;
  
  const user = mockUsers.get(uid);
  if (!user) {
    // ユーザーがなければ作成
    const newUser = { 
      uid, 
      displayName: uid.includes('demo') ? 'デモユーザー' : 'ユーザー',
      email: `${uid}@example.com`,
      photoURL: '',
      friends: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUsers.set(uid, newUser);
  }
  
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const post = {
    _id: 'post-' + Date.now(),
    userId: uid,
    userName: user?.displayName || 'デモユーザー',
    userPhoto: user?.photoURL || '',
    text,
    imageURL: imageURL || '',
    location: location || '',
    reactions: { heart: 0, fire: 0, laugh: 0 },
    createdAt: new Date(),
    expiresAt
  };
  
  mockPosts.push(post);
  res.status(201).json({ message: 'Post created', post });
});

// リアクション追加
app.post('/api/posts/:id/reaction', (req, res) => {
  const { reactionType } = req.body;
  const post = mockPosts.find(p => p._id === req.params.id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  if (post.reactions[reactionType] !== undefined) {
    post.reactions[reactionType] += 1;
  }
  
  res.json({ message: 'Reaction added', post });
});

// 投稿削除
app.delete('/api/posts/:id', (req, res) => {
  const index = mockPosts.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  mockPosts.splice(index, 1);
  res.json({ message: 'Post deleted' });
});

// ============ テスト用エンドポイント ============

// 全データリセット
app.post('/api/test/reset', (req, res) => {
  mockUsers.clear();
  mockPosts.length = 0;
  mockUsers.set('demo-user', {
    uid: 'demo-user',
    displayName: 'デモユーザー',
    email: 'demo@example.com',
    photoURL: '',
    friends: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  res.json({ message: 'All data reset' });
});

// テスト投稿作成（何件も）
app.post('/api/test/seed', (req, res) => {
  const now = new Date();
  const testTexts = [
    '今朝、コーヒーを飲んでます ☕',
    'プログラミング中 💻',
    '散歩してきます 🚶',
    'お昼ごはん 何にしよう 🍜',
    'ゲームしてまーす 🎮',
  ];
  
  for (let i = 0; i < 5; i++) {
    const expiresAt = new Date(now.getTime() + (i % 3) * 60 * 60 * 1000);
    mockPosts.push({
      _id: `test-post-${Date.now()}-${i}`,
      userId: 'demo-user',
      userName: 'デモユーザー',
      userPhoto: '',
      text: testTexts[i],
      imageURL: '',
      location: '',
      reactions: { heart: Math.floor(Math.random() * 10), fire: Math.floor(Math.random() * 5), laugh: Math.floor(Math.random() * 3) },
      createdAt: new Date(now.getTime() - i * 60 * 60 * 1000),
      expiresAt
    });
  }
  
  res.json({ message: 'Seed data created', count: 5 });
});

// データ確認
app.get('/api/test/debug', (req, res) => {
  res.json({
    users: Array.from(mockUsers.entries()).map(([k, v]) => ({ uid: k, ...v, email: undefined })),
    postsCount: mockPosts.length,
    posts: mockPosts.map(p => ({ _id: p._id, userName: p.userName, text: p.text, reactions: p.reactions }))
  });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 NowShare API Server running on port ${PORT} (MOCK MODE)`);
  console.log(`📝 API Documentation:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/test - Test endpoint`);
  console.log(`   GET  /api/users - All users`);
  console.log(`   POST /api/users/upsert - Create/update user`);
  console.log(`   GET  /api/users/:uid - Get user`);
  console.log(`   GET  /api/posts - Get timeline posts`);
  console.log(`   POST /api/posts - Create post`);
  console.log(`   POST /api/posts/:id/reaction - Add reaction`);
  console.log(`   POST /api/test/reset - Reset all data`);
  console.log(`   POST /api/test/seed - Create test posts`);
  console.log(`   GET  /api/test/debug - Debug data`);
});
