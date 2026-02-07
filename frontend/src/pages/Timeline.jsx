// 改良版Timeline - リアルタイム更新対応

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, CardContent, Typography, Avatar, Box, IconButton, Skeleton, Chip } from '@mui/material';
import { Heart, Fire, SentimentVerySatisfied, Refresh } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const Timeline = ({ onPostSuccess }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // 投稿取得
  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('投稿の取得に失敗しました');
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    fetchPosts();
    
    // 投稿成功時に更新
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
    try {
      await fetch(`${API_URL}/posts/${postId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type }),
      });
      fetchPosts(); // 更新
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  // 手動更新
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // 残り時間計算
  const getRemainingTime = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return '削除済み';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}時間${minutes}分後に消えます`;
    return `${minutes}分後に消えます`;
  };

  // 日付フォーマット
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          🏠 タイムライン
        </Typography>
        <IconButton onClick={handleRefresh} disabled={refreshing}>
          <Refresh className={refreshing ? 'spinning' : ''} />
        </IconButton>
      </Box>

      {/* ローディング */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
          ))}
        </Box>
      )}

      {/* エラー */}
      {error && (
        <Card sx={{ mb: 3, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography color="error">❌ {error}</Typography>
          </CardContent>
        </Card>
      )}

      {/* 投稿リスト */}
      {!loading && !error && (
        <>
          {posts.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                まだ投稿がありません
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最初の投稿をしてみましょう！📝
              </Typography>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id} sx={{ mb: 3, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.01)' } }}>
                <CardContent>
                  {/* ユーザー情報 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={post.userPhoto} sx={{ mr: 2, width: 48, height: 48, bgcolor: 'primary.main' }}>
                      {post.userName?.[0] || '?'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {post.userName || '匿名'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.createdAt)}
                        <Chip 
                          label={getRemainingTime(post.expiresAt)} 
                          size="small" 
                          color="warning" 
                          sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                        />
                      </Typography>
                    </Box>
                  </Box>

                  {/* 画像 */}
                  {post.imageURL && (
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={post.imageURL}
                        alt="Post image"
                        style={{
                          width: '100%',
                          borderRadius: 12,
                          maxHeight: 400,
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )}

                  {/* テキスト */}
                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {post.text}
                  </Typography>

                  {/* リアクション */}
                  <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #eee', pt: 2 }}>
                    <IconButton 
                      onClick={() => addReaction(post._id, 'heart')}
                      sx={{ '&:hover': { bgcolor: 'pink.light' } }}
                    >
                      ❤️ <Typography variant="body2" sx={{ ml: 0.5 }}>{post.reactions?.heart || 0}</Typography>
                    </IconButton>
                    <IconButton 
                      onClick={() => addReaction(post._id, 'fire')}
                      sx={{ '&:hover': { bgcolor: 'orange.light' } }}
                    >
                      🔥 <Typography variant="body2" sx={{ ml: 0.5 }}>{post.reactions?.fire || 0}</Typography>
                    </IconButton>
                    <IconButton 
                      onClick={() => addReaction(post._id, 'laugh')}
                      sx={{ '&:hover': { bgcolor: 'yellow.light' } }}
                    >
                      😂 <Typography variant="body2" sx={{ ml: 0.5 }}>{post.reactions?.laugh || 0}</Typography>
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </>
      )}
    </Container>
  );
};

export default Timeline;
