// Profileページ

import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Avatar, Box, TextField, Button } from '@mui/material';

const API_URL = 'http://localhost:3000/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // デモユーザー情報
    const demoUser = {
      uid: 'demo-user-123',
      displayName: 'デモユーザー',
      email: 'demo@example.com',
      photoURL: '',
      friends: []
    };
    setUser(demoUser);
    setLoading(false);
  }, []);

  if (loading) {
    return <Container><Typography>読み込み中...</Typography></Container>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar 
            src={user?.photoURL} 
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: 48 }}
          >
            {user?.displayName?.[0]}
          </Avatar>
          <Typography variant="h5">
            {user?.displayName || 'ゲスト'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            📊 統計
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="caption">
                投稿
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="caption">
                友人
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="caption">
                リアクション
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button variant="outlined" color="primary" fullWidth>
          ✏️ プロフィール編集
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;
