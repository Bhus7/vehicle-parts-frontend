import React, { useState, useEffect } from 'react';
import {
  Box, IconButton, Badge, Avatar, useTheme, Menu, MenuItem,
  ListItemIcon, ListItemText, Typography, Button, Tooltip
} from '@mui/material';
import { Bell, LogOut, RefreshCw, Eye, EyeOff, Package, Menu as MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

interface Notification {
  notificationID: number;
  userID: number;
  notificationType: string;
  message: string;
  createdDate: string;
  isRead: boolean;
}

interface TopbarProps {
  handleDrawerToggle?: () => void;
}

function Topbar({ handleDrawerToggle }: TopbarProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  
  // Real Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = () => {
    api.get('/Notifications')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
      });
  };

  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every 30 seconds for real-time responsiveness
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggleRead = async (e: React.MouseEvent, notif: Notification) => {
    e.stopPropagation(); // Prevent menu close and navigation
    try {
      const endpoint = `/Notifications/${notif.notificationID}/${notif.isRead ? 'unread' : 'read'}`;
      await api.put(endpoint);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to update notification status", err);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    handleNotifClose();
    if (!notif.isRead) {
      try {
        await api.put(`/Notifications/${notif.notificationID}/read`);
        fetchNotifications();
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
    
    // Redirect to Parts Inventory page which acts as stock reminder!
    if (notif.notificationType === 'LowStock') {
      navigate('/admin/parts');
    } else if (notif.notificationType === 'CustomerRequest') {
      navigate('/admin/requests');
    }
  };

  const handleTriggerCheck = async () => {
    setRefreshing(true);
    try {
      await api.get('/Notifications/check-now');
      fetchNotifications();
      alert("Notification check completed successfully! Any new low stock items have been loaded.");
    } catch (err) {
      console.error(err);
      alert("Failed to run notification check.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map(n => api.put(`/Notifications/${n.notificationID}/read`)));
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <Box
      sx={{
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'space-between', md: 'flex-end' },
        px: { xs: 2, sm: 4 },
        bgcolor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: 'none' } }}
      >
        <MenuIcon size={20} />
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton color="inherit" onClick={handleNotifOpen}>
          <Badge badgeContent={unreadCount} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#F29F67', color: '#fff' } }}>
            <Bell size={20} />
          </Badge>
        </IconButton>

        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.secondary.main, fontSize: '0.9rem' }}>{getInitials(user.fullName || user.FullName)}</Avatar>
        </IconButton>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          slotProps={{ paper: { sx: { width: 360, mt: 1.5, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } } }}
        >
          <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
              <Typography variant="caption" color="text.secondary">{unreadCount} unread alert(s)</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Trigger Stock Check Now">
                <IconButton size="small" onClick={handleTriggerCheck} disabled={refreshing}>
                  <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
              {unreadCount > 0 && (
                <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '11px', fontWeight: 'bold' }}>
                  Mark all read
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <Box sx={{ py: 4, px: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Package size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <Typography variant="body2">No stock alerts or reminders found.</Typography>
              </Box>
            ) : (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.notificationID}
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: notif.isRead ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  {/* Warning Dot Icon */}
                  <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', justifyContext: 'center' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: notif.isRead ? '#94a3b8' : '#e11d48'
                    }} />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: notif.isRead ? 'normal' : 'bold',
                        color: notif.isRead ? 'text.secondary' : 'text.primary',
                        fontSize: '0.85rem',
                        lineHeight: 1.3
                      }}
                    >
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '10px' }}>
                      {new Date(notif.createdDate).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </Typography>
                  </Box>

                  {/* Toggle Read/Unread Icon Button */}
                  <Tooltip title={notif.isRead ? "Mark as Unread" : "Mark as Read"}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleToggleRead(e, notif)}
                      sx={{ color: notif.isRead ? 'text.disabled' : 'primary.main', p: 0.5, mt: -0.5 }}
                    >
                      {notif.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              ))
            )}
          </Box>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogOut size={18} /></ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Topbar;
