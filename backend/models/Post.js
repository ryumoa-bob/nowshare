// Postモデル

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userPhoto: { type: String, default: '' },
  text: { type: String, maxlength: 200 },
  imageURL: { type: String, default: '' },
  location: { type: String, default: '' },
  reactions: {
    heart: { type: Number, default: 0 },
    fire: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 }
  },
  viewers: [{ type: String }],  // Firebase UID列表
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }  // 24時間後に削除
});

// インデックス（検索性能向上）
postSchema.index({ createdAt: -1 });
postSchema.index({ userId: 1 });
postSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 24時間後に自動削除（MongoDB TTL）
postSchema.pre('save', function(next) {
  if (this.isNew) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);  // 24時間後
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
