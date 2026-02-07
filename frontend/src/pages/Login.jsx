// ============================================
// NowShare - Professional Login Page
// ============================================

import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Divider, 
  IconButton, InputAdornment, Alert, CircularProgress,
  Avatar, useTheme, useMediaQuery
} from '@mui/material';
import { 
  Visibility, VisibilityOff, Google as GoogleIcon, Apple as AppleIcon,
  Email, Lock, ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // メールログ인
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

  // エラーメッセージ取得
  const getErrorMessage = (code) => {
    const messages = {
      'auth/user-not-found': 'ユーザーが見つかりません',
      'auth/wrong-password': 'パスワードが正しくありません',
      'auth/invalid-email': 'メールアドレスが正しくありません',
      'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
      'auth/popup-closed-by-user': 'ログインがキャンセルされました',
    };
    return messages[code] || 'ログインに失敗しました';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <MotionPaper
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          bgcolor: 'white',
        }}
      >
        {/* ロゴ */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
              }}
            >
              NowShare
            </Typography>
          </motion.div>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            今この瞬を共有しよう
          </Typography>
        </Box>

        {/* エラー表示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* ログ인フォーム */}
        <form onSubmit={handleEmailLogin}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TextField
              fullWidth
              label="パスワード"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MotionButton
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !email || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                fontSize: '1rem',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  ログイン
                  <ArrowForward sx={{ ml: 1 }} />
                </>
              )}
            </MotionButton>
          </motion.div>
        </form>

        {/* 区切り */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            または
          </Typography>
        </Divider>

        {/* SNSログイン */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ flex: 1 }}
          >
            <MotionButton
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                py: 1.5,
                borderRadius: 3,
                borderColor: '#DBEAFE',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#6366F1',
                  bgcolor: '#F8FAFC',
                },
              }}
            >
              Google
            </MotionButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            style={{ flex: 1 }}
          >
            <MotionButton
              fullWidth
              variant="outlined"
              startIcon={<AppleIcon />}
              disabled
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                py: 1.5,
                borderRadius: 3,
                borderColor: '#DBEAFE',
                color: 'text.primary',
              }}
            >
              Apple
            </MotionButton>
          </motion.div>
        </Box>

        {/* 新規登録リンク */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            アカウントをお持ちでないですか？{' '}
            <Typography
              component={Link}
              to="/login#signup"
              variant="body2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              新規登録
            </Typography>
          </Typography>
        </motion.div>

        {/* フッター */}
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 3 }}>
          ログインすることで、
          <Typography component="span" variant="caption" sx={{ color: 'primary.main' }}>
            利用規約
          </Typography>
          と
          <Typography component="span" variant="caption" sx={{ color: 'primary.main' }}>
            プライバシーポリシー
          </Typography>
          に同意したことになります。
        </Typography>
      </MotionPaper>
    </Box>
  );
};

export default Login;
