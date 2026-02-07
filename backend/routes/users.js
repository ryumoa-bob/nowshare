// Users APIルート

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 全ユーザー取得
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ユーザー作成・更新（Firebase UIDで）
router.post('/upsert', async (req, res) => {
  try {
    const { uid, displayName, email, photoURL } = req.body;
    
    let user = await User.findOne({ uid });
    
    if (user) {
      // 更新
      user.displayName = displayName;
      user.email = email;
      user.photoURL = photoURL;
      await user.save();
      res.json({ message: 'User updated', user });
    } else {
      // 新規作成
      user = new User({ uid, displayName, email, photoURL });
      await user.save();
      res.status(201).json({ message: 'User created', user });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ユーザー情報取得
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid }).select('-email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 友人追加
router.post('/:uid/friends', async (req, res) => {
  try {
    const { friendUid } = req.body;
    const user = await User.findOne({ uid: req.params.uid });
    const friend = await User.findOne({ uid: friendUid });
    
    if (!user || !friend) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
      await user.save();
    }
    
    res.json({ message: 'Friend added', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 友人一覧取得
router.get('/:uid/friends', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid }).populate('friends', '-email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
