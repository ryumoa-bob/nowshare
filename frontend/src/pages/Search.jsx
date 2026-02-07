// ============================================
// NowShare - Professional Search Page
// ============================================

import React, { useState, useCallback } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, Tabs, Tab, 
  Avatar, Chip, Paper, List, ListItem, ListItemAvatar, 
  ListItemText, Divider, Button, useTheme, useMediaQuery,
  Skeleton
} from '@mui/material';
import { 
  Search as SearchIcon, Person, Image as ImageIcon, 
  TrendingUp, Clear
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Search = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'ラーメン',
    'カフェ',
    '旅行',
  ]);
  const [trending, setTrending] = useState([
    { tag: '#今日の一枚', count: '1.2万' },
    { tag: '#週末旅行', count: '8,500' },
    { tag: '#美味しいもの', count: '5,200' },
    { tag: '# Workout', count: '3,100' },
    { tag: '#勉強垢', count: '2,800' },
  ]);

  // 検索実行
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // 最近検索に追加
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    // ダミー結果（実際はAPIから取得）
    setTimeout(() => {
      setResults({
        users: [
          { id: 1, name: '田中太郎', username: 'tanaka', avatar: '', bio: '写真は趣味です' },
          { id: 2, name: '佐藤花子', username: 'sato_hana', avatar: '', bio: '旅行が好き' },
        ],
        posts: [
          { id: 1, text: '今日の sunset #写真', user: 'tanaka', likes: 120 },
          { id: 2, text: 'カフェで作業中 #カフェ', user: 'sato_hana', likes: 85 },
        ],
        tags: [
          { tag: '#今日の一枚', count: '1.2万' },
          { tag: '# sunset', count: '3,400' },
          { tag: '#写真撮る人と連携', count: '890' },
        ],
      });
      setLoading(false);
    }, 500);
  }, [recentSearches]);

  // 検索クリア
  const handleClear = () => {
    setQuery('');
    setResults(null);
  };

  // 検索候補クリック
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', pb: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: 'white' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          検索
        </Typography>
        
        {/* 検索ボックス */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TextField
            fullWidth
            placeholder="検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClear}>
                    <Clear />
                  </IconButton>
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
        </MotionBox>

        {/* タブ */}
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="fullWidth"
          sx={{ mt: 2 }}
        >
          <Tab label="すべて" />
          <Tab label="ユーザー" />
          <Tab label="投稿" />
        </Tabs>
      </Box>

      {/* コンテンツ */}
      <Box sx={{ p: 2 }}>
        <AnimatePresence mode="wait">
          {/* 検索実行中の場合 */}
          {loading ? (
            <MotionBox
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="40%" height={20} />
                    <Skeleton width="30%" height={14} sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
              ))}
            </MotionBox>
          ) : results ? (
            /* 検索結果あり */
            <MotionBox
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* ユーザー結果 */}
              {(tabValue === 0 || tabValue === 1) && results.users && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    ユーザー
                  </Typography>
                  {results.users.map((user) => (
                    <Paper
                      key={user.id}
                      component={Link}
                      to={`/profile/${user.id}`}
                      elevation={0}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        mb: 1,
                        borderRadius: 3,
                        bgcolor: '#F8FAFC',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#F1F5F9',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Avatar src={user.avatar} sx={{ bgcolor: 'primary.main' }}>
                        {user.name[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                      <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                        フォロー
                      </Button>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* 投稿結果 */}
              {(tabValue === 0 || tabValue === 2) && results.posts && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    投稿
                  </Typography>
                  {results.posts.map((post) => (
                    <Paper
                      key={post.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 3,
                        bgcolor: '#F8FAFC',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#F1F5F9',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          @{post.user}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {post.text}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* ハッシュタグ結果 */}
              {(tabValue === 0 || tabValue === 2) && results.tags && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    ハッシュタグ
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {results.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={`${tag.tag} (${tag.count})`}
                        onClick={() => handleSuggestionClick(tag.tag)}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </MotionBox>
          ) : (
            /* 検索結果なし - トレンドと最近の検索を表示 */
            <MotionBox
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* トレンド */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp sx={{ color: 'error.main' }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    トレンド
                  </Typography>
                </Box>
                {trending.map((item, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    onClick={() => handleSuggestionClick(item.tag)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      mb: 1,
                      borderRadius: 3,
                      cursor: 'pointer',
                      bgcolor: 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary.main">
                        {item.tag}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.count}件の投稿
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* 最近の検索 */}
              {recentSearches.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      最近の検索
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={() => setRecentSearches([])}
                      sx={{ borderRadius:                       クリア
2 }}
                    >
                    </Button>
                  </Box>
                  {recentSearches.map((search, i) => (
                    <Paper
                      key={i}
                      elevation={0}
                      onClick={() => handleSuggestionClick(search)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        mb: 1,
                        borderRadius: 3,
                        cursor: 'pointer',
                        bgcolor: 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#F8FAFC',
                        },
                      }}
                    >
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {search}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Search;
