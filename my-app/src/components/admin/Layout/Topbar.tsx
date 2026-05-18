import React, { useState } from 'react';
import { Box, IconButton, Badge, Avatar, useTheme, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Bell, Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import { useThemeContext } from '../../../contexts/ThemeContextProvider';

function Topbar() {
  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  return (
    <Box
      sx={{
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 4,
        bgcolor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton color="inherit" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>

        <IconButton color="inherit" onClick={handleNotifOpen}>
          <Badge badgeContent={2} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#F29F67', color: '#fff' } }}>
            <Bell size={20} />
          </Badge>
        </IconButton>

        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.secondary.main, fontSize: '0.9rem' }}>A</Avatar>
        </IconButton>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          slotProps={{ paper: { sx: { width: 320, mt: 1.5, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } } }}
        >
          <Box sx={{ px: 2, py: 1.5, fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.divider}` }}>
            Notifications
          </Box>
          <MenuItem onClick={handleNotifClose} sx={{ py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box>
              <Box sx={{ fontWeight: 'bold', color: 'error.main', fontSize: '0.875rem' }}>Low Stock Alert</Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>5 items are below threshold.</Box>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotifClose} sx={{ py: 1.5 }}>
            <Box>
              <Box sx={{ fontWeight: 'bold', color: 'warning.main', fontSize: '0.875rem' }}>Overdue Payment</Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>3 customers have overdue credits.</Box>
            </Box>
          </MenuItem>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >

          <MenuItem onClick={handleClose}>
            <ListItemIcon><User size={18} /></ListItemIcon>
            <ListItemText primary="My Profile" />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon><Settings size={18} /></ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogOut size={18} /></ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Topbar;
