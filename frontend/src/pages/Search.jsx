// ============================================
// NowShare - BeReal Style Search
// ============================================

import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Tabs, Tab, Avatar, Paper, 
  List, ListItem, ListItemAvatar, ListItemText, Divider, InputBase
} from '@mui/material';
import { Search as SearchIcon, Clear } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Search = () => {
  const [tabValue, setTabValue] = useState(0);
  const [query, setQuery] = useState('');

  const trending = [
    { tag: '今日の一枚', count: '1.2万' },
    { tag: '週末旅行', count: '8,500' },
    { tag: '美味しいもの', count: '5,200' },
  ];

  const recentSearches = ['ラーメン', 'カフェ'];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', pb: 12 }}>
      {/* ヘッダー */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid #E0E0E0',
          bgcolor: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h6" fontWeight="600" gutterBottom>
          検索
        </Typography>
        
        {/* 検索ボックス */}
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            border: '1px solid #E0E0E0',
          }}
        >
          <SearchIcon sx={{ color: '#999', mr: 1 }} />
          <InputBase
            placeholder="検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}>
              <Clear />
            </IconButton>
          )}
        </Paper>
      </Box>

      {/* タブ */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #E0E0E0' }}>
        {['すべて', 'ユーザー', '投稿'].map((label, i) => (
          <Box
            key={label}
            onClick={() => setTabValue(i)}
            sx={{
              flex: 1,
              py: 2,
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: tabValue === i ? '2px solid #000000' : 'none',
              fontWeight: tabValue === i ? 600 : 400,
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      {/* コンテンツ */}
      <Box sx={{ p: 2 }}>
        {/* トレンド */}
        {!query && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              トレンド
            </Typography>
            {trending.map((item, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#F5F5F5',
                  },
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    {item.tag}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.count}件の投稿
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* 最近の検索 */}
        {!query && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              最近の検索
            </Typography>
            {recentSearches.map((search, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#F5F5F5',
                  },
                }}
              >
                <SearchIcon sx={{ color: '#999', mr: 1 }} />
                <Typography variant="body2">
                  {search}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* 検索結果 */}
        {query && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              "{query}" の検索結果
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Search;
