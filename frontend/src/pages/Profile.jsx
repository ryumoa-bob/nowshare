// ============================================
// NowShare - Professional Profile Page
// ============================================

import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Avatar, Button, IconButton, Tabs, Tab,
  Grid, Card, CardContent, Chip, Divider, useTheme, useMediaQuery,
  Skeleton, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress
} from '@mui/material';
import { 
  Edit, LocationOn, Link as LinkIcon, CalendarMonth,
  Image, Collections, Person, Settings, VerifiedUser,
  AddAPhoto, MoreVert, Share
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Profile = () => {
  const { uid } = useParams();
  const { user: currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
  });

  const isOwnProfile = !uid || uid === currentUser?.uid;

  // プロフィール取得
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const targetUid = uid || currentUser?.uid;
        if (!targetUid) {
          setProfile(null);
          setLoading(false);
          return;
        }
        
        const res = await fetch(`${API_URL}/users/${targetUid}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditData({
            displayName: data.displayName || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [uid, currentUser]);

  // ローディング状態
  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
      {/* カバー画像 */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          height: { xs: 150, md: 250 },
          bgcolor: 'primary.light',
          borderRadius: { xs: 0, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          mb: 8,
        }}
      >
        {profile?.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        
        {/* カバー画像変更ボタン */}
        {isOwnProfile && (
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <AddAPhoto />
          </IconButton>
        )}
      </MotionBox>

      {/* プロフィール情報 */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, gap: 3 }}>
          {/* アバター */}
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            sx={{ 
              position: 'relative',
              mt: { xs: -60, md: -80 },
            }}
          >
            <Avatar
              src={profile?.photoURL}
              sx={{ 
                width: { xs: 100, md: 140 },
                height: { xs: 100, md: 140 },
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                bgcolor: 'primary.main',
              }}
            >
              <Typography variant="h3">{profile?.displayName?.[0] || '?'}</Typography>
            </Avatar>
            {profile?.isVerified && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                }}
              >
                <VerifiedUser sx={{ fontSize: 16, color: 'white' }} />
              </Box>
            )}
          </MotionBox>

          {/* 名前と情報 */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h4" fontWeight="bold">
                {profile?.displayName || 'ユーザー'}
              </Typography>
              {profile?.isVerified && (
                <Chip
                  icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                  label="認定"
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              @{profile?.username || 'username'}
            </Typography>
            
            {/* 詳細情報 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {profile?.bio && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {profile.bio}
                </Typography>
              )}
              {profile?.location && (
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16 }} />
                  {profile.location}
                </Typography>
              )}
              {profile?.website && (
                <Typography 
                  component="a"
                  href={profile.website}
                  variant="body2"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <LinkIcon sx={{ fontSize: 16 }} />
                  {profile.website.replace(/^https?:\/\//, '')}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonth sx={{ fontSize: 16 }} />
                {profile?.joinedAt 
                  ? new Date(profile.joinedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
                  : 'Joined recently'}
              </Typography>
            </Box>
          </Box>

          {/* アクションボタン */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isOwnProfile ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ borderRadius: 3, px: 3 }}
                >
                  プロフィールを編集
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    startIcon={<Person />}
                    sx={{ borderRadius: 3, px: 3 }}
                  >
                    フォロー
                  </Button>
                </motion.div>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {/* 統計 */}
        <Box sx={{ display: 'flex', gap: 4, mt: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {profile?.followingCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              フォロー中
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {profile?.followersCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              フォロワー
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {profile?.postsCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              投稿
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* タブ */}
      <Paper 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          zIndex: 10,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 56,
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.main',
              height: 3,
              borderRadius: 3,
            },
          }}
        >
          <Tab icon={<Collections />} iconPosition="start" label="投稿" />
          <Tab icon={<Image />} iconPosition="start" label="メディア" />
          <Tab icon={<Person />} iconPosition="start" label="いいね" />
        </Tabs>
      </Paper>

      {/* タブコンテンツ */}
      <Box sx={{ py: 3 }}>
        {tabValue === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Collections sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              まだ投稿がありません
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Image sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              まだメディアがありません
            </Typography>
          </Box>
        )}
        {tabValue === 2 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Favorite sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              まだいいねした投稿がありません
            </Typography>
          </Box>
        )}
      </Box>

      {/* 編集ダイアログ */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle>プロフィールを編集</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="表示名"
              fullWidth
              value={editData.displayName}
              onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
            />
            <TextField
              label="自己紹介"
              fullWidth
              multiline
              rows={3}
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            />
            <TextField
              label="場所"
              fullWidth
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            <TextField
              label="ウェブサイト"
              fullWidth
              value={editData.website}
              onChange={(e) => setEditData({ ...editData, website: e.target.value })}
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={() => {
              // 保存処理
              setEditDialogOpen(false);
            }}
            sx={{ borderRadius: 3, px: 4 }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
