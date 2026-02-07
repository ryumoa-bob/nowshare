// ============================================
// NowShare - BeReal Style Header (Bottom Navigation)
// ============================================

import React, { useState } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, IconButton, 
  BottomNavigation, BottomNavigationAction, Badge, Avatar,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
  useTheme, useMediaQuery
} from '@mui/material';
import { 
  Home, AddAPhoto, Person, Notifications, Search,
  Menu, Close, Settings, Logout, CameraAlt
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navValue, setNavValue] = useState(getNavValue(location.pathname));

  // パスからナビゲーション値を計算
  function getNavValue(path) {
    if (path === '/') return 0;
    if (path === '/search') return 1;
    if (path === '/notifications') return 2;
    if (path.startsWith('/profile')) return 3;
    return 0;
  }

  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
    const paths = ['/', '/search', '/notifications', '/profile'];
    if (newValue < paths.length) {
      navigate(paths[newValue]);
    }
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { label: 'ホーム', icon: <Home />, path: '/' },
    { label: '検索', icon: <Search />, path: '/search' },
    { label: '', icon: <CameraAlt />, path: '/post', isCamera: true },
    { label: '通知', icon: <Notifications />, path: '/notifications' },
    { label: 'プロフィール', icon: <Person />, path: '/profile' },
  ];

  return (
    <>
      {/* 最小限の上部バー（モバイルのみ） */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          color="inherit"
          sx={{ 
            top: 0, 
            bottom: 'auto',
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none',
                color: '#000000',
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '-0.03em',
              }}
            >
              NowShare
            </Typography>
            
            {!user && (
              <IconButton component={Link} to="/login">
                <Person />
              </IconButton>
            )}
            
            {user && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <Avatar 
                  src={user.photoURL}
                  sx={{ width: 28, height: 28, bgcolor: '#000000' }}
                >
                  {user.displayName?.[0] || '?'}
                </Avatar>
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      )}

      {/* 桌面顶部栏 */}
      {!isMobile && (
        <AppBar 
          position="fixed" 
          color="inherit"
          sx={{ 
            top: 0, 
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 600, mx: 'auto', width: '100%' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none',
                color: '#000000',
                fontWeight: 700,
                fontSize: '1.3rem',
                letterSpacing: '-0.03em',
              }}
            >
              NowShare
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  <IconButton component={Link} to="/search">
                    <Search />
                  </IconButton>
                  <IconButton component={Link} to="/notifications">
                    <Badge badgeContent={3} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={() => setDrawerOpen(true)}>
                    <Avatar 
                      src={user.photoURL}
                      sx={{ width: 32, height: 32, bgcolor: '#000000' }}
                    >
                      {user.displayName?.[0] || '?'}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <IconButton component={Link} to="/login">
                  <Person />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* 下部ナビゲーション（モバイル） */}
      {isMobile && (
        <BottomNavigation
          value={navValue}
          onChange={handleNavChange}
          showLabels={false}
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            zIndex: 1100,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              padding: '6px 0',
            },
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.path}
              icon={
                item.isCamera ? (
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(-20%)',
                    }}
                  >
                    {item.icon}
                  </Box>
                ) : (
                  item.icon
                )
              }
              label={item.label}
              sx={{
                color: navValue === index ? '#000000' : '#666666',
                '& .MuiSvgIcon-root': {
                  fontSize: navValue === index ? 28 : 24,
                },
              }}
            />
          ))}
        </BottomNavigation>
      )}

      {/* 桌面底部导航 */}
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E0E0E0',
            zIndex: 1100,
          }}
        >
          <BottomNavigation
            value={navValue}
            onChange={handleNavChange}
            showLabels={true}
            sx={{ 
              minWidth: 400,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 60,
                padding: '8px 16px',
              },
            }}
          >
            <BottomNavigationAction 
              label="ホーム" 
              icon={<Home />} 
              sx={{ color: navValue === 0 ? '#000000' : '#666666' }}
            />
            <BottomNavigationAction 
              label="検索" 
              icon={<Search />} 
              sx={{ color: navValue === 1 ? '#000000' : '#666666' }}
            />
            <BottomNavigationAction 
              icon={
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <CameraAlt sx={{ fontSize: 24 }} />
                </Box>
              }
              sx={{ 
                color: navValue === 2 ? '#000000' : '#666666',
                '& .MuiBottomNavigationAction-wrapper': {
                  transform: navValue === 2 ? 'translateY(-8px)' : 'none',
                },
              }}
            />
            <BottomNavigationAction 
              label="通知" 
              icon={<Notifications />} 
              sx={{ color: navValue === 3 ? '#000000' : '#666666' }}
            />
            <BottomNavigationAction 
              label="プロフィール" 
              icon={<Person />} 
              sx={{ color: navValue === 4 ? '#000000' : '#666666' }}
            />
          </BottomNavigation>
        </Box>
      )}

      {/* メニューDrawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 300 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            メニュー
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        
        <Divider />
        
        {user && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={user.photoURL}
              sx={{ width: 48, height: 48, bgcolor: '#000000' }}
            >
              {user.displayName?.[0] || '?'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                {user.displayName || 'ユーザー'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username || 'username'}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Divider />
        
        <List>
          <ListItem 
            button 
            component={Link} 
            to="/profile"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="プロフィール" />
          </ListItem>
          <ListItem 
            button 
            component={Link} 
            to="/notifications"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="通知" />
          </ListItem>
          <ListItem 
            button 
            component={Link} 
            to="/search"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon><Search /></ListItemIcon>
            <ListItemText primary="検索" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText primary="設定" />
          </ListItem>
          <ListItem button onClick={handleLogout} sx={{ color: '#FF6B6B' }}>
            <ListItemIcon><Logout sx={{ color: '#FF6B6B' }} /></ListItemIcon>
            <ListItemText primary="ログアウト" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header;
