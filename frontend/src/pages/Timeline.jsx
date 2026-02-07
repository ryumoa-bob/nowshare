// ============================================
// NowShare - BeReal Style Timeline
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Avatar, IconButton, 
  Chip, Paper, Skeleton, InputBase, Divider
} from '@mui/material';
import { 
  FavoriteBorder, Favorite, LocalFire, ChatBubbleOutline,
  ShareOutlined, BookmarkBorder, Bookmark, MoreVert,
  ArrowBack, Search
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';

const Timeline = ({ onPostSuccess }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // リアクション定義
  const reactionTypes = {
    heart: { emoji: '❤️', label: '-heart' },
    fire: { emoji: '🔥', label: 'fire' },
  };

  // 投稿取得
  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('取得に失敗しました');
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    if (typeof window !== 'undefined') {
      window.onPostSuccess = fetchPosts;
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.onPostSuccess = null;
      }
    };
  }, [fetchPosts]);

  // リアクション追加
  const addReaction = async (postId, type) => {
    if (!user) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type }),
      });
      fetchPosts();
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  // 日付フォーマット
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'たった今';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`;
    
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  // 残り時間計算
  const getRemainingTime = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return '削除済み';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}時間${minutes}分`;
    return `${minutes}分`;
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 12, pt: 2 }}>
      {/* 検索バー（Desktop） */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            border: '1px solid #E0E0E0',
            borderRadius: 0,
          }}
        >
          <Search sx={{ color: '#999', mr: 1 }} />
          <InputBase placeholder="検索" sx={{ flex: 1 }} />
        </Paper>
      </Box>

      {/* エラー */}
      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#FFF5F5', border: '1px solid #FF6B6B' }}>
          <Typography color="#FF6B6B">{error}</Typography>
        </Paper>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <Box>
          {[1, 2, 3].map((i) => (
            <Paper key={i} sx={{ mb: 0, border: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={44} height={44} />
                  <Box sx={{ ml: 1.5, flex: 1 }}>
                    <Skeleton width="30%" height={16} />
                    <Skeleton width="20%" height={12} sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
                <Skeleton width="100%" height={200} sx={{ borderRadius: 0 }} />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Skeleton width={60} height={32} />
                  <Skeleton width={60} height={32} />
                  <Skeleton width={60} height={32} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Posts */}
      {!loading && !error && (
        <>
          {posts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #E0E0E0' }}>
              <Typography variant="h6" gutterBottom>
                まだ投稿がありません
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最初の投稿をしてみましょう
              </Typography>
            </Paper>
          ) : (
            posts.map((post) => (
              <Paper 
                key={post._id} 
                sx={{ 
                  mb: 0, 
                  border: '1px solid #E0E0E0',
                  borderBottom: '1px solid #E0E0E0',
                  borderRadius: 0,
                }}
              >
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={post.userPhoto}
                    sx={{ width: 44, height: 44, bgcolor: '#000000' }}
                  >
                    {post.userName?.[0] || '?'}
                  </Avatar>
                  <Box sx={{ ml: 1.5, flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600">
                      {post.userName || '匿名'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Image */}
                {post.imageURL && (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={post.imageURL}
                      alt="Post"
                      style={{
                        width: '100%',
                        display: 'block',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Time Badge */}
                    <Chip
                      label={getRemainingTime(post.expiresAt)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                )}

                {/* Text Only */}
                {!post.imageURL && (
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {post.text}
                    </Typography>
                    <Chip
                      label={`${getRemainingTime(post.expiresAt)}後に削除`}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: '#F5F5F5',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Reactions */}
                  {Object.entries(reactionTypes).map(([type, config]) => (
                    <Box
                      key={type}
                      onClick={() => addReaction(post._id, type)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#F5F5F5',
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: 18 }}>
                        {post.reactions?.[type] ? config.emoji : config.emoji}
                      </Typography>
                      {post.reactions?.[type] > 0 && (
                        <Typography variant="body2" fontWeight="500">
                          {post.reactions[type]}
                        </Typography>
                      )}
                    </Box>
                  ))}

                  <Box sx={{ flex: 1 }} />

                  {/* Comment */}
                  <IconButton size="small">
                    <ChatBubbleOutline />
                  </IconButton>

                  {/* Share */}
                  <IconButton size="small">
                    <ShareOutlined />
                  </IconButton>

                  {/* Bookmark */}
                  <IconButton size="small">
                    <BookmarkBorder />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </>
      )}
    </Container>
  );
};

export default Timeline;
