// NowShare フロントエンド

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// テーマ設定
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#F7F7F7',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
  },
});

// コンポーネント
import Header from './components/Header';
import Timeline from './pages/Timeline';
import PostForm from './pages/PostForm';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/post" element={<PostForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
