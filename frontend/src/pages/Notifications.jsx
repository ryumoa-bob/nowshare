// ============================================
// NowShare - BeReal Style Notifications
// ============================================

import React, { useState } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText, 
  Avatar, IconButton, Badge, Paper, Divider, Button
} from '@mui/material';
import { 
  Favorite, Comment, Person, Notifications as NotificationsIcon,
  Settings, DoneAll
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const notifications = [
    { id: 1, type: 'like', user: '田中太郎', content: 'いいねしました', time: '5分前', read: false },
    { id: 2, type: 'comment', user: '佐藤花子', content: 'コメントしました', time: '1時間前', read: false },
    { id: 3, type: 'follow', user: '山田健太', content: 'フォローしました', time: '3時間前', read: true },
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      like: <Favorite sx={{ color: '#FF6B6B' }} />,
      comment: <Comment sx={{ color: '#6366F1' }} />,
      follow: <Person sx={{ color: '#4CAF50' }} />,
    };
    return icons[type] || <NotificationsIcon />;
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', pb: 12 }}>
      {/* ヘッダー */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          borderBottom: '1px solid #E0E0E0',
          bgcolor: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h6" fontWeight="600">
          通知
        </Typography>
        <IconButton size="small">
          <DoneAll />
        </IconButton>
      </Box>

      {/* タブ */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #E0E0E0' }}>
        <Box
          onClick={() => setTabValue(0)}
          sx={{
            flex: 1,
            py: 2,
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: tabValue === 0 ? '2px solid #000000' : 'none',
            fontWeight: tabValue === 0 ? 600 : 400,
          }}
        >
          すべて
        </Box>
        <Box
          onClick={() => setTabValue(1)}
          sx={{
            flex: 1,
            py: 2,
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: tabValue === 1 ? '2px solid #000000' : 'none',
            fontWeight: tabValue === 1 ? 600 : 400,
          }}
        >
          フォロー
        </Box>
      </Box>

      {/* 通知リスト */}
      <List sx={{ p: 0 }}>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              component={Link}
              to="/"
              sx={{
                py: 2,
                px: 2,
                bgcolor: notification.read ? 'transparent' : '#F9F9F9',
                '&:hover': {
                  bgcolor: '#F5F5F5',
                },
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#000000' }}>
                  {notification.user[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="600">
                      {notification.user}
                    </Typography>
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#000000',
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {notifications.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            通知がありません
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Notifications;
