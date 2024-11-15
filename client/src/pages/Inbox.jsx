import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Grid,
  CircularProgress, Alert, Chip,
} from '@mui/material';
import { Search as SearchIcon, Inbox as InboxIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { retriveUserID } from '../middlewares/RetriveUserID.js';
import DashboardLayout from '../layouts/DashboardLayout';
import DocCard from '../components/DocCard';

const Inbox = () => {
  const [documents, setDocuments] = useState([]);
  const [senders, setSenders] = useState([]);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_SERVER_BASE_URL;

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userEmail = await retriveUserID();
        if (userEmail.user) {
          setEmail(userEmail.email);
        } else {
          setError('Unauthorized or Invalid token');
          navigate('/signin');
        }
      } catch {
        setError('An error occurred while checking the auth status.');
        navigate('/signin');
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
      const fileNameWithQuery = docUrl.split('/').pop();
      const fileName = fileNameWithQuery.split('?')[0];
      const decodedFileName = decodeURIComponent(fileName);
      const fileNameOnly = decodedFileName.split('/').pop();
      const [nameWithExt, datePart, timePartAndExt] = fileNameOnly.split('_');
      const name = nameWithExt.includes('.pdf') ? nameWithExt.replace('.pdf', '') : nameWithExt;
      let time = '';
      if (timePartAndExt) {
        const timePart = timePartAndExt.replace('.pdf', '');
        const [hour24, minute] = timePart.split('-');
        let hour12 = parseInt(hour24, 10);
        const ampm = hour12 >= 12 ? 'PM' : 'AM';
        hour12 = hour12 % 12 || 12;
        time = `${hour12}:${minute} ${ampm}`;
      }
      return { name, date: datePart || 'Unknown', time };
    } catch {
      return { name: 'Unknown', date: 'Unknown', time: '' };
    }
  };

  // Filter documents by search term
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
      <DashboardLayout title="Inbox" subtitle="Your received documents" userEmail={email}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#0d9488' }} />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Inbox" subtitle="Your received documents" userEmail={email}>
        <Alert severity="error" sx={{ borderRadius: 2, maxWidth: 500 }}>{error}</Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Inbox"
      subtitle="Your received documents"
      badge={`${documents.length} document${documents.length !== 1 ? 's' : ''}`}
      userEmail={email}
    >
      {/* Search bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search by name or sender…"
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
        <Box
          sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: 10, color: '#94a3b8',
          }}
        >
          <InboxIcon sx={{ fontSize: 56, mb: 2, opacity: 0.4 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b', mb: 0.5 }}>
            {search ? 'No matching documents' : 'Your inbox is empty'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            {search ? 'Try a different search term.' : 'Documents sent to you will appear here.'}
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
};

export default Inbox;
