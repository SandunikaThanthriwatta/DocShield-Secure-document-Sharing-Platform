import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from '../components/Sidebar';

export default function DashboardLayout({ children, title, subtitle, badge, userEmail }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Sidebar userEmail={userEmail} />

      <Box
        sx={{
          flex: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            px: 4,
            py: 3,
            bgcolor: 'white',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {title}
              </Typography>
              {badge !== undefined && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(13,148,136,0.1)',
                    color: '#0d9488',
                    fontWeight: 600,
                    fontSize: '12px',
                    height: 22,
                  }}
                />
              )}
            </Box>
            {subtitle && (
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
