// ============================================
// NowShare - BeReal Style Login Page
// ============================================

import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Divider, 
  IconButton, InputAdornment, Alert, CircularProgress, Avatar
} from '@mui/material';
import { 
  Visibility, VisibilityOff, Google as GoogleIcon,
  Email, Lock, ArrowForward
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // メールログイン
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Googleログイン
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // エラーメッセージ
  const getErrorMessage = (code) => {
    const messages = {
      'auth/user-not-found': 'ユーザーが見つかりません',
      'auth/wrong-password': 'パスワードが正しくありません',
      'auth/invalid-email': 'メールアドレスが正しくありません',
      'auth/popup-closed-by-user': 'キャンセルされました',
    };
    return messages[code] || 'ログインに失敗しました';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#FFFFFF',
        p: 2,
      }}
    >
      {/* ロゴ */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: '#000000',
          mb: 1,
        }}
      >
        NowShare
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        今この瞬間を共有しよう
      </Typography>

      {/* エラー */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 360 }}>
          {error}
        </Alert>
      )}

      {/* ログインフォーム */}
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <form onSubmit={handleEmailLogin}>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="パスワード"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#999' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !email || !password}
            sx={{
              bgcolor: '#000000',
              borderRadius: 0,
              py: 1.5,
              '&:hover': {
                bgcolor: '#333333',
              },
              '&.Mui-disabled': {
                bgcolor: '#CCCCCC',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'ログイン'
            )}
          </Button>
        </form>

        {/* 区切り */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            または
          </Typography>
        </Divider>

        {/* Googleログイン */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{
            borderColor: '#E0E0E0',
            color: '#000000',
            borderRadius: 0,
            py: 1.5,
            '&:hover': {
              borderColor: '#000000',
              bgcolor: '#F5F5F5',
            },
          }}
        >
          Googleでログイン
        </Button>

        {/* 新規登録 */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          アカウントをお持ちでないですか？{' '}
          <Typography
            component={Link}
            to="/login#signup"
            variant="body2"
            sx={{
              color: '#000000',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            新規登録
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
