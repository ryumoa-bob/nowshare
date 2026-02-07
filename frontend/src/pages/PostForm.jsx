// ============================================
// NowShare - Professional Post Form
// ============================================

import React, { useState, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, IconButton, 
  Avatar, Chip, Slider, LinearProgress, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  Image as ImageIcon, Close, LocationOn, Label
} from '@mui/material';
import { 
  Image, Close as CloseIcon, AddAPhoto, Send, 
  LocationOn as LocationIcon, EmojiEmotions, Progress
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const PostForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 画像選択
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    processImages(files);
  };

  // 画像ドラッグ＆ドロップ
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    processImages(files);
  };

  // 画像処理
  const processImages = async (files) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const newImages = [];
    
    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          file,
          preview: e.target.result,
          id: Date.now() + Math.random(),
        });
        if (newImages.length === imageFiles.length) {
          setImages(prev => [...prev, ...newImages].slice(0, 4)); // 最大4枚
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 画像削除
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // 位置情報取得
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setError('位置情報を取得できませんでした');
        }
      );
    } else {
      setError('位置情報がサポートされていません');
    }
  };

  // 投稿削除
  const handleDeletePost = () => {
    if (window.confirm('下書きを削除しますか？')) {
      setText('');
      setImages([]);
      setLocation('');
    }
  };

  // 投稿送信
  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) {
      setError('テキストまたは画像を入力してください');
      return;
    }
    
    if (!user) {
      setError('ログインが必要です');
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // 画像をFirebase Storageにアップロード
      const imageURLs = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${i}`);
        await uploadBytes(storageRef, image.file);
        const url = await getDownloadURL(storageRef);
        imageURLs.push(url);
        setUploadProgress(((i + 1) / images.length) * 100);
      }

      // APIに投稿
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          text: text.trim(),
          imageURL: imageURLs[0], // 最初の画像（複数対応时可拡張）
          location: location || undefined,
        }),
      });
      
      if (!response.ok) throw new Error('投稿に失敗しました');
      
      // 成功！
      if (typeof window !== 'undefined' && window.onPostSuccess) {
        window.onPostSuccess();
      }
      navigate('/');
    } catch (err) {
      console.error('Post error:', err);
      setError(err.message || '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 最大文字数
  const maxChars = 500;
  const charCount = text.length;
  const isOverLimit = charCount > maxChars;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 }, pb: 12 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            新規投稿
          </Typography>
          <Box sx={{ flex: 1 }} />
          {(text || images.length > 0) && (
            <Button
              color="error"
              onClick={handleDeletePost}
              startIcon={<Close />}
            >
              破棄
            </Button>
          )}
        </Box>

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

        {/* アップロード進行中 */}
        {isSubmitting && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Progress size={24} />
              <Typography variant="body2" color="text.secondary">
                {uploadProgress < 100 ? '画像をアップロード中...' : '投稿を送信中...'}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ mt: 1, borderRadius: 1 }} 
            />
          </Box>
        )}

        {/* メイン投稿エリア */}
        <Paper
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            border: '1px solid #eee',
            bgcolor: 'white',
          }}
        >
          {/* ユーザー情報 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar
              src={user?.photoURL}
              sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
            >
              {user?.displayName?.[0] || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="600">
                {user?.displayName || 'ユーザー'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{user?.username || 'username'}
              </Typography>
            </Box>
          </Box>

          {/* テキスト入力 */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            placeholder="今何してる？"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '1.1rem',
                '& textarea': {
                  resize: 'vertical',
                },
              },
            }}
            disabled={isSubmitting}
          />

          {/* 文字数カウンター */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isOverLimit ? 'error.main' : charCount > maxChars * 0.9 ? 'warning.main' : 'text.secondary' 
              }}
            >
              {charCount} / {maxChars}
            </Typography>
          </Box>

          {/* 画像プレビュー */}
          {images.length > 0 && (
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr',
                gap: 1,
                mt: 2,
              }}
            >
              {images.map((image, index) => (
                <MotionBox
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    aspectRatio: images.length > 1 ? '1' : '16/9',
                  }}
                >
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    onClick={() => removeImage(image.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  {index === 3 && images.length > 4 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                    >
                      +{images.length - 4}
                    </Box>
                  )}
                </MotionBox>
              ))}
            </Box>
          )}

          {/* 位置情報 */}
          {location && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ mt: 2 }}
            >
              <Chip
                icon={<LocationIcon />}
                label={location}
                onDelete={() => setLocation('')}
                sx={{ borderRadius: 2 }}
              />
            </MotionBox>
          )}

          {/* アップロード領域 */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : '#ddd',
              borderRadius: 3,
              bgcolor: dragActive ? 'primary.light' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: '#F8FAFC',
              },
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <Box sx={{ textAlign: 'center' }}>
              <AddAPhoto sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                画像をドラッグ＆ドロップ、またはクリックして選択
              </Typography>
              <Typography variant="caption" color="text.disabled">
                最大4枚、JPG/PNG対応
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* アクションボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleGetLocation}
              sx={{ 
                color: location ? 'primary.main' : 'text.secondary',
                bgcolor: location ? 'primary.light' : 'transparent',
              }}
            >
              <LocationOn />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <EmojiEmotions />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {text || images.length > 0 ? '下書き保存中...' : ''}
            </Typography>
            
            <MotionButton
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || (!text.trim() && images.length === 0) || isOverLimit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              }}
            >
              <Send sx={{ mr: 1, fontSize: 18 }} />
              投稿する
            </MotionButton>
          </Box>
        </Box>

        {/* ヘルプテキスト */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
          24時間後に投稿は自動的に削除されます
        </Typography>
      </motion.div>
    </Box>
  );
};

export default PostForm;
