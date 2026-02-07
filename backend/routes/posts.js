// Posts APIルート

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// 全投稿取得（タイムライン用）
router.get('/', async (req, res) => {
  try {
    // 24時間以内の投稿を取得
    const now = new Date();
    const posts = await Post.find({
      createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) }
    })
    .sort({ createdAt: -1 })
    .limit(100);
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ユーザーの投稿取得
router.get('/user/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新規投稿作成
router.post('/', async (req, res) => {
  try {
    const { uid, text, imageURL, location } = req.body;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const post = new Post({
      userId: user._id,
      userName: user.displayName,
      userPhoto: user.photoURL,
      text,
      imageURL,
      location
    });
    
    await post.save();
    
    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// リアクション追加
router.post('/:id/reaction', async (req, res) => {
  try {
    const { reactionType } = req.body;  // heart, fire, laugh
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.reactions[reactionType] !== undefined) {
      post.reactions[reactionType] += 1;
      await post.save();
    }
    
    res.json({ message: 'Reaction added', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 投稿削除（手動）
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//期限切れ投稿削除（クリーンアップ用）
router.delete('/expired/cleanup', async (req, res) => {
  try {
    const result = await Post.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    res.json({ message: `Deleted ${result.deletedCount} expired posts` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
