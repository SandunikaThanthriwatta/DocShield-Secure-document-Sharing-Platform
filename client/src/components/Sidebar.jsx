import React from 'react';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Send as SendIcon,
  FolderOpen as FolderIcon,
  Shield as ShieldIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: 'Inbox', icon: <InboxIcon sx={{ fontSize: 20 }} />, path: '/inbox' },
  { label: 'Compose', icon: <SendIcon sx={{ fontSize: 20 }} />, path: '/compose' },
  { label: 'My Documents', icon: <FolderIcon sx={{ fontSize: 20 }} />, path: '/docs' },
];

export default function Sidebar({ userEmail }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    navigate('/signin');
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: '100vh',
        bgcolor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38, height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(13,148,136,0.4)',
          }}
        >
          <ShieldIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ color: 'white', fontWeight: 800, letterSpacing: '-0.02em', fontSize: '18px' }}
        >
          DocShield
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, py: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.25)',
            px: 1.5, mb: 1.5, display: 'block',
            letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '10px',
          }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.25,
                    px: 1.5,
                    bgcolor: isActive ? 'rgba(13,148,136,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #0d9488' : '3px solid transparent',
                    ml: isActive ? 0 : 0,
                    '&:hover': {
                      bgcolor: isActive
                        ? 'rgba(13,148,136,0.2)'
                        : 'rgba(255,255,255,0.05)',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#5eead4' : 'rgba(255,255,255,0.35)',
                      minWidth: 36,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#e2e8f0' : 'rgba(255,255,255,0.5)',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* User footer */}
      <Box sx={{ px: 2, py: 2.5 }}>
        {userEmail && (
          <Box
            sx={{
              px: 1.5, mb: 1.5,
              display: 'flex', alignItems: 'center', gap: 1.5,
              py: 1,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.04)',
            }}
          >
            <Avatar
              sx={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                fontSize: '13px', fontWeight: 700,
              }}
            >
              {userEmail.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.7)', fontSize: '12px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  lineHeight: 1.4,
                }}
              >
                {userEmail}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
                Signed in
              </Typography>
            </Box>
          </Box>
        )}
        <ListItemButton
          onClick={handleSignOut}
          sx={{
            borderRadius: '10px',
            py: 1, px: 1.5,
            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
            transition: 'all 0.15s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(239,68,68,0.6)', minWidth: 36 }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '14px',
              color: 'rgba(239,68,68,0.6)',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
