import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: '260px', display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
