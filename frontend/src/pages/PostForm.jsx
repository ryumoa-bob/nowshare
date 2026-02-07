// 改良版PostForm - 画像アップロード対応

import React, { useState, useRef } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const PostForm = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // 画像選択
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB制限
        setMessage({ type: 'error', text: 'ファイルサイズは5MB以下にしてください' });
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  // 画像削除
  const handleImageRemove = () => {
    setImage(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 投稿送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setMessage({ type: 'error', text: 'テキストを入力してください' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageURL = '';
      
      // 画像がある場合はアップロード（Firebase Storageに上げる）
      if (image) {
        // デモモードでは画像をスキップ
        console.log('画像アップロードはデモモードではスキップされます');
        imageURL = '';
      }

      // APIに投稿送信
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user?.uid || 'demo-user',
          text: text.trim(),
          imageURL: imageURL,
          location: '',
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ 投稿しました！' });
        setText('');
        handleImageRemove();
        
        // 親コンポーネントに通知（コールバック）
        if (typeof window !== 'undefined' && window.onPostSuccess) {
          window.onPostSuccess();
        }
      } else {
        throw new Error('投稿に失敗しました');
      }
    } catch (err) {
      console.error('投稿エラー:', err);
      setMessage({ type: 'error', text: '❌ 投稿に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          📝 今、何してる？
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* テキスト入力 */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="今、何してる？📸"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
            disabled={loading}
          />

          {/* 画像アップロード */}
          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            
            {!preview ? (
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={loading}
                >
                  📷 写真を選ぶ（最大5MB）
                </Button>
              </label>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                  }}
                >
                  <Button
                    size="small"
                    color="error"
                    onClick={handleImageRemove}
                    startIcon={<Close />}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  >
                    削除
                  </Button>
                </Box>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    maxHeight: 300,
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* 送信ボタン */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={loading || !text.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '投稿中...' : '📤 投稿する'}
          </Button>
        </form>

        {/* メッセージ表示 */}
        {message.text && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}

        {/* デモモード表示 */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          align="center"
          sx={{ mt: 2 }}
        >
          📌 デモモード：画像はアップロードされません
        </Typography>
      </Paper>
    </Container>
  );
};

export default PostForm;
