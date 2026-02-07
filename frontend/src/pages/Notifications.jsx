// ============================================
// NowShare - Professional Notifications Page
// ============================================

import React, { useState } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText, 
  Avatar, IconButton, Badge, Paper, Divider, Button, useTheme, Tab, Tabs
} from '@mui/material';
import { 
  Favorite, Comment, Person, Image, VerifiedUser,
  Repeat, Bookmark, Notifications as NotificationsIcon,
  Settings, DoneAll
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MotionListItem = motion(ListItem);

const Notifications = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();
  
  // ダミーデータ（実際はAPIから取得）
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: { name: '田中太郎', avatar: '', username: 'tanaka' },
      content: 'あなたの投稿にいいねしました',
      time: '5分前',
      read: false,
      postId: '123',
    },
    {
      id: 2,
      type: 'comment',
      user: { name: '佐藤花子', avatar: '', username: 'sato' },
      content: '面白いですね！',
      time: '1時間前',
      read: false,
      postId: '124',
    },
    {
      id: 3,
      type: 'follow',
      user: { name: '山田健太', avatar: '', username: 'yamada' },
      content: 'フォローしました',
      time: '3時間前',
      read: true,
      userId: '456',
    },
    {
      id: 4,
      type: 'mention',
      user: { name: '高橋美咲', avatar: '', username: 'takahashi' },
      content: '投稿で言及しました',
      time: '1日前',
      read: true,
      postId: '125',
    },
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      like: { icon: <Favorite sx={{ color: '#EF4444' }} />, bgcolor: '#FEE2E2' },
      comment: { icon: <Comment sx={{ color: '#6366F1' }} />, bgcolor: '#E0E7FF' },
      follow: { icon: <Person sx={{ color: '#10B981' }} />, bgcolor: '#D1FAE5' },
      mention: { icon: <Image sx={{ color: '#EC4899' }} />, bgcolor: '#FCE7F3' },
      repost: { icon: <Repeat sx={{ color: '#F59E0B' }} />, bgcolor: '#FEF3C7' },
      bookmark: { icon: <Bookmark sx={{ color: '#8B5CF6' }} />, bgcolor: '#EDE9FE' },
    };
    return icons[type] || { icon: <NotificationsIcon />, bgcolor: '#F3F4F6' };
  };

  const markAllAsRead = () => {
    // API呼び出し
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', pb: 4 }}>
      {/* ヘッダー */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #eee',
          bgcolor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          通知
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={markAllAsRead} title="すべて既読にする">
            <DoneAll />
          </IconButton>
          <IconButton title="通知設定">
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* タブ */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        variant="fullWidth"
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #eee',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 48,
          },
        }}
      >
        <Tab label="すべて" />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>未読</span>
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error" />
            </Box>
          } 
        />
      </Tabs>

      {/* 通知リスト */}
      <List sx={{ p: 0 }}>
        <AnimatePresence>
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                通知がありません
              </Typography>
              <Typography variant="body2" color="text.disabled">
                新しい通知が届くと、ここに表示されます
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => {
              const { icon, bgcolor } = getNotificationIcon(notification.type);
              
              return (
                <MotionListItem
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  component={Link}
                  to={notification.postId ? `/post/${notification.postId}` : `/profile/${notification.userId}`}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid #f5f5f5',
                    bgcolor: notification.read ? 'transparent' : 'rgba(99, 102, 241, 0.03)',
                    '&:hover': {
                      bgcolor: '#F8FAFC',
                    },
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  {/* 未読インジケーター */}
                  {!notification.read && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                  )}
                  
                  {/* アイコン */}
                  <Avatar
                    sx={{ 
                      bgcolor: bgcolor,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {notification.user.avatar ? (
                      <img 
                        src={notification.user.avatar} 
                        alt={notification.user.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      icon
                    )}
                  </Avatar>
                  
                  {/* 内容 */}
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          {notification.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{notification.user.username}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                          {notification.content}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                </MotionListItem>
              );
            })
          )}
        </AnimatePresence>
      </List>

      {/* フッター */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Button color="inherit" sx={{ borderRadius: 3 }}>
          過去の通知を読み込む
        </Button>
      </Box>
    </Box>
  );
};

export default Notifications;
