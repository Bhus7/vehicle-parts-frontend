import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { LayoutDashboard, Package, Users, ShoppingCart, History, ShieldAlert } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
  { text: 'Parts Inventory', icon: <Package size={20} />, path: '/admin/parts' },
  { text: 'Vendors', icon: <Users size={20} />, path: '/admin/vendors' },
  { text: 'New Purchase', icon: <ShoppingCart size={20} />, path: '/admin/purchase/new' },
  { text: 'Purchase History', icon: <History size={20} />, path: '/admin/purchase/history' },
  { text: 'Staff Management', icon: <ShieldAlert size={20} />, path: '/admin/staff' },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: '#1E1E2C', // Dark Navy always for Sidebar
        color: '#FFFFFF',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: theme.palette.primary.main }} />
        <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          AutoParts
        </Box>
      </Box>

      <List sx={{ mt: 2, px: 2 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(242, 159, 103, 0.15)' : 'transparent',
                  color: active ? theme.palette.primary.main : '#A0A0B0',
                  '&:hover': {
                    bgcolor: 'rgba(242, 159, 103, 0.08)',
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
