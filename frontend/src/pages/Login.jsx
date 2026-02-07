// 改良版Loginページ - デモログイン対応

import React from 'react';
import { Container, Paper, Typography, Button, Box, Divider } from '@mui/material';
import { Google, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // デモログインボタンハンドル
  const handleDemoLogin = async () => {
    try {
      await login();
      navigate('/');
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  // Googleログインボタンハンドル（未実装）
  const handleGoogleLogin = () => {
    alert('GoogleログインはFirebase設定後に利用可能です');
    // TODO: Firebase Auth実装
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        {/* アプリ名 */}
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          📸 NowShare
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          今の瞬間を共有しよう
        </Typography>

        <Divider sx={{ my: 4 }}>
          <Typography variant="caption" color="text.secondary">
            ログイン
          </Typography>
        </Divider>

        {/* Googleログインボタン */}
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          fullWidth
          sx={{ mb: 2, py: 1.5 }}
        >
          Googleでログイン
        </Button>

        {/* デモログインボタン */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Person />}
          onClick={handleDemoLogin}
          fullWidth
          sx={{ mb: 3, py: 1.5 }}
        >
          🚀 デモモードで始める
        </Button>

        {/* 説明文 */}
        <Typography variant="caption" color="text.secondary" display="block">
          📌 デモモードでは、実際のログインなしに
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          アプリの機能を試すことができます
        </Typography>

        <Divider sx={{ my: 4 }}>
          <Typography variant="caption" color="text.secondary">
            または
          </Typography>
        </Divider>

        {/* 新規登録リンク */}
        <Typography variant="body2" color="text.secondary">
          アカウントをお持ちでない方は
        </Typography>
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => alert('新規登録はデモモード，您可以从主页直接使用')}
        >
          こちら请点击Demo按钮
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
