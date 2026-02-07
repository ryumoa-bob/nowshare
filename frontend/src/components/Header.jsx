// ============================================
// NowShare - Professional Header
// ============================================

import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, 
  Avatar, Badge, Menu, MenuItem, Divider, useTheme, useMediaQuery,
  Drawer, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Home, AddAPhoto, Person, Notifications, Search, 
  Logout, Settings, Menu as MenuIcon, DarkMode, LightMode
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'タイムライン', icon: <Home /> },
    { path: '/post', label: '投稿', icon: <AddAPhoto /> },
    { path: '/notifications', label: '通知', icon: <Notifications /> },
    { path: '/search', label: '検索', icon: <Search /> },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          📸 NowShare
        </Typography>
        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ようこそ、{user.displayName || 'ユーザー'}さん
          </Typography>
        )}
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.path}
            component={Link} 
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{ 
              mx: 1, 
              borderRadius: 2,
              mb: 0.5,
              bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
              color: location.pathname === item.path ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: location.pathname === item.path ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'primary.contrastText' : 'primary.main' 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      {user && (
        <List>
          <ListItem 
            button 
            component={Link} 
            to={`/profile/${user.uid}`}
            onClick={() => setMobileOpen(false)}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="プロフィール" />
          </ListItem>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ mx: 1, borderRadius: 2, color: 'error.main' }}
          >
            <ListItemIcon><Logout color="error" /></ListItemIcon>
            <ListItemText primary="ログアウト" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit"
        sx={{ 
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant="h5" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              NowShare
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                      bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                      px: 2,
                      py: 1,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          {/* User Menu / Login Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <IconButton color="inherit" component={Link} to="/profile">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          bgcolor: 'success.main',
                          borderRadius: '50%',
                          border: '2px solid white',
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={user.photoURL}
                      sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                    >
                      {user.displayName?.[0] || '?'}
                    </Avatar>
                  </Badge>
                </IconButton>
                <IconButton onClick={handleMenu}>
                  <Settings />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: { width: 220, mt: 1, borderRadius: 3 }
                  }}
                >
                  <MenuItem component={Link} to={`/profile/${user.uid}`} onClick={handleClose}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    プロフィール
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    設定
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                    ログアウト
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    borderRadius: 20,
                    px: 3,
                  }}
                >
                  ログイン
                </Button>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
