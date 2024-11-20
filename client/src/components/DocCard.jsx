import React from 'react';
import {
  Card, CardContent, CardActions, Box, Typography, IconButton,
  Chip, Tooltip, Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  OpenInNew as OpenIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import PdfThumbnail from './PdfThumbnail';

const isLocalUrl = (url) => url && url.includes('/uploads/');

export default function DocCard({ name, dateAndTime, sender, docLink }) {
  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!docLink) return;
    try {
      const response = await fetch(docLink);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(docLink, '_blank');
    }
  };

  const handleOpen = () => {
    if (docLink) window.open(docLink, '_blank');
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 260,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onClick={handleOpen}
    >
      {/* PDF preview area */}
      <Box
        sx={{
          bgcolor: '#f8fafc',
          height: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f1f5f9',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isLocalUrl(docLink) ? (
          <PdfThumbnail url={docLink} />
        ) : (
          <Box sx={{ width: 56, height: 56, borderRadius: '14px', background: 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(13,148,136,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PdfIcon sx={{ color: '#0d9488', fontSize: 32 }} />
          </Box>
        )}
        <Chip
          label="PDF"
          size="small"
          sx={{
            position: 'absolute', top: 10, right: 10,
            bgcolor: 'rgba(13,148,136,0.1)',
            color: '#0d9488',
            fontWeight: 600,
            fontSize: '10px',
            height: 20,
          }}
        />
      </Box>

      <CardContent sx={{ p: 2, pb: 1 }}>
        {/* Document name */}
        <Typography
          sx={{
            fontWeight: 700, color: '#1e293b', fontSize: '14px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            mb: 1.5,
          }}
        >
          {name || 'Untitled Document'}
        </Typography>

        {/* Sender */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <PersonIcon sx={{ color: '#94a3b8', fontSize: 13 }} />
          <Typography
            sx={{
              color: '#64748b', fontSize: '12px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {sender || 'Unknown sender'}
          </Typography>
        </Box>

        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarIcon sx={{ color: '#94a3b8', fontSize: 13 }} />
          <Typography sx={{ color: '#94a3b8', fontSize: '12px' }}>
            {dateAndTime || '—'}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ mx: 2, borderColor: '#f1f5f9' }} />

      <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
        <Tooltip title="Download">
          <IconButton
            size="small"
            onClick={handleDownload}
            sx={{
              color: '#0d9488',
              bgcolor: 'rgba(13,148,136,0.08)',
              borderRadius: '8px',
              '&:hover': { bgcolor: 'rgba(13,148,136,0.15)', transform: 'scale(1.05)' },
              transition: 'all 0.15s ease',
            }}
          >
            <DownloadIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open in new tab">
          <IconButton
            size="small"
            onClick={handleOpen}
            sx={{
              color: '#64748b',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#f1f5f9', color: '#0d9488' },
              transition: 'all 0.15s ease',
            }}
          >
            <OpenIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
