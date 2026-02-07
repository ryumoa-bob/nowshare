// ============================================
// NowShare - Professional Timeline
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Container, Card, CardContent, Typography, Avatar, Box, IconButton, 
  Skeleton, Chip, TextField, InputAdornment, Fab, Paper, Tooltip,
  Collapse, Alert
} from '@mui/material';
import { 
  Heart, LocalFire, SentimentVerySatisfied, Refresh, Image,
  LocationOn, Schedule, Comment, ShareVert,
, Bookmark, More  FavoriteBorder, Favorite, Whatshot, Search
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const Timeline = ({ onPostSuccess }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const observerRef = useRef();
  const postsEndRef = useRef();

  // リアクションタイプ定義
  const reactionTypes = {
    heart: { emoji: '❤️', color: '#EF4444', label: '-heart' },
    fire: { emoji: '🔥', color: '#F59E0B', label: 'fire' },
    laugh: { emoji: '😂', color: '#10B981', label: 'laugh' },
    star: { emoji: '⭐', color: '#6366F1', label: 'star' },
    love: { emoji: '😍', color: '#EC4899', label: 'love' },
  };

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
    
    if (typeof window !== 'undefined') {
      window.onPostSuccess = fetchPosts;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.onPostSuccess = null;
      }
    };
  }, [fetchPosts]);

  // リアクション追加/削除
  const toggleReaction = async (postId, type) => {
    if (!user) {
      setError('ログインが必要です');
      return;
    }
    
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
    
    if (diff <= 0) return { text: '削除済み', color: 'error' };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) return { text: `${hours}時間${minutes}分`, color: 'warning' };
    if (minutes > 0) return { text: `${minutes}分${seconds}秒`, color: 'error' };
    return { text: `${seconds}秒`, color: 'error' };
  };

  // 日付フォーマット
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'たった今';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`;
    
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // フィルタリング
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'withImage' && !post.imageURL) return false;
    return true;
  });

  // フィルタタブ
  const filterTabs = [
    { value: 'all', label: 'すべて' },
    { value: 'withImage', label: '画像あり' },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
      {/* ヘッダーセクション */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 検索バー */}
        <Paper
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 4,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          }}
          elevation={0}
        >
          <TextField
            fullWidth
            placeholder="投稿を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#F8FAFC',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                },
              },
            }}
          />
          
          {/* フィルタタブ */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
            {filterTabs.map((tab) => (
              <Chip
                key={tab.value}
                label={tab.label}
                onClick={() => setFilter(tab.value)}
                variant={filter === tab.value ? 'filled' : 'outlined'}
                color={filter === tab.value ? 'primary' : 'default'}
                sx={{ 
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* 更新ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="更新">
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': { bgcolor: 'primary.main' },
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      {/* エラー表示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ローディングスケルトン */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card sx={{ mb: 3, overflow: 'hidden' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Skeleton width="40%" height={20} />
                      <Skeleton width="30%" height={14} sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  <Skeleton width="100%" height={100} sx={{ borderRadius: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton width={60} height={32} sx={{ borderRadius: 2 }} />
                    <Skeleton width={60} height={32} sx={{ borderRadius: 2 }} />
                    <Skeleton width={60} height={32} sx={{ borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {/* 投稿リスト */}
      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Paper
                sx={{ 
                  textAlign: 'center', 
                  py: 8, 
                  px: 4,
                  borderRadius: 4,
                  bgcolor: 'white',
                }}
                elevation={0}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Typography variant="h4">📝</Typography>
                </Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  まだ投稿がありません
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  最初の投稿をしてみましょう！
                </Typography>
                {user && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      icon={<Image />}
                      label="投稿する"
                      component="a"
                      href="/post"
                      sx={{ 
                        mt: 3,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: 2,
                        px: 2,
                        py: 2.5,
                        cursor: 'pointer',
                      }}
                    />
                  </motion.div>
                )}
              </Paper>
            </motion.div>
          ) : (
            filteredPosts.map((post, index) => {
              const timeInfo = getRemainingTime(post.expiresAt);
              
              return (
                <motion.div key={post._id} variants={itemVariants}>
                  <Card
                    sx={{ 
                      mb: 3,
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                    elevation={0}
                  >
                    {/* ユーザー情報ヘッダー */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2,
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Avatar
                          src={post.userPhoto}
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: 'primary.main',
                            border: '2px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                        >
                          {post.userName?.[0] || '?'}
                        </Avatar>
                      </motion.div>
                      
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {post.userName || '匿名ユーザー'}
                          </Typography>
                          {post.isVerified && (
                            <Chip
                              label="✓"
                              size="small"
                              sx={{ 
                                height: 18, 
                                fontSize: '0.7rem',
                                bgcolor: 'primary.main',
                                color: 'white',
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(post.createdAt)}
                          </Typography>
                          {post.location && (
                            <>
                              <LocationOn sx={{ fontSize: 14, color: 'text.secondary', ml: 1 }} />
                              <Typography variant="caption" color="text.secondary">
                                {post.location}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>

                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* 画像セクション */}
                    {post.imageURL && (
                      <Box sx={{ position: 'relative', bgcolor: '#F8FAFC' }}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <img
                            src={post.imageURL}
                            alt="Post image"
                            style={{
                              width: '100%',
                              maxHeight: 500,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </motion.div>
                        
                        {/* 時間チップ */}
                        <Chip
                          icon={<Schedule />}
                          label={timeInfo.text}
                          size="small"
                          color={timeInfo.color}
                          sx={{ 
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(4px)',
                          }}
                        />
                      </Box>
                    )}

                    {/* テキストセクション */}
                    {!post.imageURL && (
                      <Box sx={{ p: 2 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.8,
                            fontSize: '1rem',
                          }}
                        >
                          {post.text}
                        </Typography>
                        <Chip
                          icon={<Schedule />}
                          label={timeInfo.text}
                          size="small"
                          color={timeInfo.color}
                          sx={{ mt: 2, borderRadius: 2 }}
                        />
                      </Box>
                    )}

                    {/* 画像ありの場合のテキスト */}
                    {post.imageURL && post.text && (
                      <Box sx={{ p: 2 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.8,
                          }}
                        >
                          {post.text}
                        </Typography>
                      </Box>
                    )}

                    {/* タグ表示 */}
                    {post.tags && post.tags.length > 0 && (
                      <Box sx={{ px: 2, pb: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {post.tags.map((tag, i) => (
                            <Chip
                              key={i}
                              label={`#${tag}`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                borderColor: 'primary.light',
                                color: 'primary.main',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* リアクション統計 */}
                    {post.reactions && Object.values(post.reactions).some(v => v > 0) && (
                      <Box 
                        sx={{ 
                          px: 2, 
                          py: 1, 
                          borderTop: '1px solid rgba(0,0,0,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: -0.5 }}>
                          {Object.entries(post.reactions)
                            .filter(([_, count]) => count > 0)
                            .slice(0, 3)
                            .map(([type]) => (
                              <Typography key={type} sx={{ fontSize: 16 }}>
                                {reactionTypes[type]?.emoji || '👍'}
                              </Typography>
                            ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {Object.values(post.reactions).reduce((a, b) => a + b, 0)}件
                        </Typography>
                      </Box>
                    )}

                    {/* アクションボタン */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        px: 1,
                        pb: 1,
                        gap: 0.5,
                      }}
                    >
                      {Object.entries(reactionTypes).map(([type, config]) => (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Chip
                            icon={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {post.reactions?.[type] ? (
                                  <Typography sx={{ fontSize: 16 }}>{config.emoji}</Typography>
                                ) : (
                                  <FavoriteBorder sx={{ fontSize: 18, color: 'text.secondary' }} />
                                )}
                                {post.reactions?.[type] > 0 && (
                                  <Typography variant="body2" sx={{ color: config.color }}>
                                    {post.reactions[type]}
                                  </Typography>
                                )}
                              </Box>
                            }
                            onClick={() => toggleReaction(post._id, type)}
                            sx={{ 
                              borderRadius: 2,
                              bgcolor: 'transparent',
                              '&:hover': {
                                bgcolor: `${config.color}15`,
                              },
                            }}
                          />
                        </motion.div>
                      ))}
                      
                      <Box sx={{ flex: 1 }} />
                      
                      <Chip
                        icon={<Comment />}
                        label={post.commentCount || 0}
                        onClick={() => {/* コメント機能 */}}
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        icon={<Share />}
                        onClick={() => {/* シェア機能 */}}
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        icon={<Bookmark />}
                        onClick={() => {/* ブックマーク機能 */}}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

      {/*  Floating Action Button for Mobile */}
      {user && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Fab
            component="a"
            href="/post"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Image />
          </Fab>
        </motion.div>
      )}
      
      <div ref={postsEndRef} />
    </Container>
  );
};

export default Timeline;
