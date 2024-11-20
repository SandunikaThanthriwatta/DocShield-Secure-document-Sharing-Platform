import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Alert, TextField,
  InputAdornment, Chip,
} from '@mui/material';
import { Search as SearchIcon, FolderOpen as FolderIcon } from '@mui/icons-material';
import { retriveUserID } from '../middlewares/RetriveUserID.js';
import DashboardLayout from '../layouts/DashboardLayout';
import DocCard from './DocCard';

export default function ViewMyDocs() {
  const [documents, setDocuments] = useState([]);
  const [senders, setSenders] = useState([]);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const apiURL = import.meta.env.VITE_SERVER_BASE_URL;

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userEmail = await retriveUserID();
        if (userEmail.user) {
          setEmail(userEmail.email);
        } else {
          setError('Unauthorized or Invalid token');
        }
      } catch {
        setError('An error occurred while checking the auth status.');
      }
    };
    checkUserAuth();
  }, []);

  useEffect(() => {
    const fetchUserDocs = async () => {
      if (!email) return;
      try {
        const response = await fetch(`${apiURL}/api/user/get-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          const userData = await response.json();
          setDocuments(userData.documents || []);
          setSenders(userData.senders || []);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch documents');
        }
      } catch {
        setError('An error occurred while fetching your documents');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDocs();
  }, [email, apiURL]);

  const extractDocNameAndDate = (docUrl) => {
    if (!docUrl || typeof docUrl !== 'string') return { name: 'Unknown', date: 'Unknown', time: '' };
    try {
      const fileName = decodeURIComponent(docUrl.split('/').pop().split('?')[0]).split('/').pop();
      const [nameWithExt, datePart, timePartAndExt] = fileName.split('_');
      const name = nameWithExt.replace('.pdf', '');
      let time = '';
      if (timePartAndExt) {
        const timePart = timePartAndExt.replace('.pdf', '');
        const [h, m] = timePart.split('-');
        let h12 = parseInt(h, 10);
        const ampm = h12 >= 12 ? 'PM' : 'AM';
        h12 = h12 % 12 || 12;
        time = `${h12}:${m} ${ampm}`;
      }
      return { name, date: datePart || 'Unknown', time };
    } catch {
      return { name: 'Unknown', date: 'Unknown', time: '' };
    }
  };

  const filteredIndexes = documents.reduce((acc, docUrl, index) => {
    const { name } = extractDocNameAndDate(docUrl);
    const sender = senders[index] || '';
    if (
      name.toLowerCase().includes(search.toLowerCase()) ||
      sender.toLowerCase().includes(search.toLowerCase())
    ) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Documents" subtitle="All your documents" userEmail={email}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#0d9488' }} />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Documents" subtitle="All your documents" userEmail={email}>
        <Alert severity="error" sx={{ borderRadius: 2, maxWidth: 500 }}>{error}</Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Documents"
      subtitle="All your documents"
      badge={`${documents.length} document${documents.length !== 1 ? 's' : ''}`}
      userEmail={email}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search documents…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ maxWidth: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
        {search && (
          <Chip
            label={`${filteredIndexes.length} result${filteredIndexes.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0d9488', fontWeight: 600 }}
          />
        )}
      </Box>

      {filteredIndexes.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, color: '#94a3b8' }}>
          <FolderIcon sx={{ fontSize: 56, mb: 2, opacity: 0.4 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b', mb: 0.5 }}>
            {search ? 'No matching documents' : 'No documents yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            {search ? 'Try a different search term.' : 'Documents you send and receive will appear here.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredIndexes.map((index) => {
            const { name, date, time } = extractDocNameAndDate(documents[index]);
            return (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <DocCard
                  name={name}
                  dateAndTime={`${date}${time ? '  ' + time : ''}`}
                  sender={senders[index] || 'Unknown'}
                  docLink={documents[index]}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </DashboardLayout>
  );
}
