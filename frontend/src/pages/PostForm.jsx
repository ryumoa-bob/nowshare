// ============================================
// NowShare - BeReal Style Post Form
// ============================================

import React, { useState, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, IconButton, 
  Avatar, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import { 
  Image, Close, LocationOn, Send, ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';

const PostForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 画像選択
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 画像削除
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // 位置情報取得
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => setError('位置情報を取得できませんでした')
      );
    }
  };

  // キャンセル
  const handleCancel = () => {
    if (text || image) {
      if (window.confirm('投稿を破棄しますか？')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // 投稿
  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('テキストまたは画像を入力してください');
      return;
    }
    
    if (!user) {
      setError('ログインが必要です');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let imageURL = null;
      
      // 画像をアップロード
      if (image) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
        await uploadBytes(storageRef, image);
        imageURL = await getDownloadURL(storageRef);
      }

      // APIに投稿
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          text: text.trim(),
          imageURL: imageURL,
        }),
      });
      
      if (!response.ok) throw new Error('投稿に失敗しました');
      
      navigate('/');
    } catch (err) {
      console.error('Post error:', err);
      setError(err.message || '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 12 }}>
      {/* ヘッダー */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: '1px solid #E0E0E0',
          position: 'sticky',
          top: 0,
          bgcolor: '#FFFFFF',
          zIndex: 10,
        }}
      >
        <IconButton onClick={handleCancel}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>
          新規投稿
        </Typography>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || (!text.trim() && !image)}
          sx={{
            bgcolor: '#000000',
            borderRadius: 0,
            px: 3,
            '&:hover': {
              bgcolor: '#333333',
            },
            '&.Mui-disabled': {
              bgcolor: '#CCCCCC',
            },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>
              投稿
              <Send sx={{ ml: 1, fontSize: 16 }} />
            </>
          )}
        </Button>
      </Box>

      {/* エラー */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      {/* メイン */}
      <Box sx={{ p: 2 }}>
        {/* ユーザー情報 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={user?.photoURL}
            sx={{ width: 40, height: 40, bgcolor: '#000000' }}
          >
            {user?.displayName?.[0] || '?'}
          </Avatar>
          <Typography variant="subtitle2" sx={{ ml: 1.5, fontWeight: 600 }}>
            {user?.displayName || 'ユーザー'}
          </Typography>
        </Box>

        {/* テキスト入力 */}
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={10}
          placeholder="今何してる？"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          multiline
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              padding: 0,
              fontSize: '1rem',
              '& textarea': {
                resize: 'none',
                padding: 0,
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          disabled={isSubmitting}
        />

        {/* 画像プレビュー */}
        {imagePreview && (
          <Box sx={{ mt: 2, position: 'relative' }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                aspectRatio: '1/1',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <IconButton
              onClick={removeImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)',
                },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        {/* 画像追加 */}
        {!imagePreview && (
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              mt: 2,
              p: 4,
              border: '1px solid #E0E0E0',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#F5F5F5',
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <Image sx={{ fontSize: 48, color: '#999', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              タップして画像を追加
            </Typography>
          </Box>
        )}

        {/* 位置情報 */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<LocationOn />}
            onClick={handleGetLocation}
            sx={{ color: '#666666' }}
          >
            位置情報を追加
          </Button>
          
          <Typography variant="caption" color="text.secondary">
            {text.length} 文字
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

// Containerコンポーネントを追加
import { Container } from '@mui/material';

export default PostForm;
