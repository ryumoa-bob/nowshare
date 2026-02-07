// ============================================
// NowShare - BeReal Style Profile Page
// ============================================

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Avatar, Button, Tabs, Tab, Grid, 
  Paper, useTheme, useMediaQuery, Skeleton, IconButton, Chip
} from '@mui/material';
import { 
  Edit, LocationOn, Link as LinkIcon, CalendarMonth,
  Image, GridOn, Person, MoreVert
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';

const Profile = () => {
  const { uid } = useParams();
  const { user: currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

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
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [uid, currentUser]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton width="40%" height={24} />
            <Skeleton width="30%" height={16} sx={{ mt: 1 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', pb: 12 }}>
      {/* カバー画像 */}
      <Box
        sx={{
          height: 200,
          bgcolor: '#F5F5F5',
          backgroundImage: profile?.coverImage ? `url(${profile.coverImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* プロフィール情報 */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: -40 }}>
          {/* アバター */}
          <Avatar
            src={profile?.photoURL}
            sx={{ 
              width: 90, 
              height: 90, 
              bgcolor: '#000000',
              border: '3px solid #FFFFFF',
            }}
          >
            <Typography variant="h4">{profile?.displayName?.[0] || '?'}</Typography>
          </Avatar>

          {/* アクションボタン */}
          {isOwnProfile ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{
                borderColor: '#000000',
                color: '#000000',
                borderRadius: 0,
                px: 3,
              }}
            >
              編集
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#000000',
                color: '#FFFFFF',
                borderRadius: 0,
                px: 3,
              }}
            >
              フォロー
            </Button>
          )}
        </Box>

        {/* 名前 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" fontWeight="600">
            {profile?.displayName || 'ユーザー'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{profile?.username || 'username'}
          </Typography>
        </Box>

        {/* Bio */}
        {profile?.bio && (
          <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.6 }}>
            {profile.bio}
          </Typography>
        )}

        {/* 情報 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {profile?.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            </Box>
          )}
          {profile?.joinedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarMonth sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(profile.joinedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}に参加
              </Typography>
            </Box>
          )}
        </Box>

        {/* 統計 */}
        <Box sx={{ display: 'flex', gap: 3, mt: 3, borderTop: '1px solid #E0E0E0', pt: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {profile?.followingCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              フォロー中
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {profile?.followersCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              フォロワー
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {profile?.postsCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              投稿
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* タブ */}
      <Paper 
        sx={{ 
          borderTop: '1px solid #E0E0E0',
          borderBottom: '1px solid #E0E0E0',
          position: 'sticky',
          top: isMobile ? 56 : 64,
          bgcolor: '#FFFFFF',
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
              fontWeight: 500,
              minHeight: 48,
            },
            '& .Mui-selected': {
              color: '#000000',
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#000000',
              height: 2,
            },
          }}
        >
          <Tab icon={<GridOn />} iconPosition="start" label="投稿" />
          <Tab icon={<Image />} iconPosition="start" label="メディア" />
          <Tab icon={<Person />} iconPosition="start" label="いいね" />
        </Tabs>
      </Paper>

      {/* タブコンテンツ */}
      <Box sx={{ py: 3 }}>
        {tabValue === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              まだ投稿がありません
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Grid container spacing={1}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={4} key={i}>
                <Box
                  sx={{
                    aspectRatio: '1',
                    bgcolor: '#F5F5F5',
                    '&:hover': {
                      bgcolor: '#EEEEEE',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {tabValue === 2 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              まだいいねした投稿がありません
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

import { Container } from '@mui/material';

export default Profile;
