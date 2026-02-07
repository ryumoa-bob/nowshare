// Headerコンポーネント

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          📸 NowShare
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            🏠 タイムライン
          </Button>
          <Button color="inherit" component={Link} to="/post">
            📝 投稿
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            👤 プロフィール
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
