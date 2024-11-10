import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Link, Alert, InputAdornment, CircularProgress,
} from '@mui/material';
import { Email as EmailIcon, Shield as ShieldIcon } from '@mui/icons-material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email.');
      return;
    }
    setLoading(true);
    // TODO: wire up to backend when endpoint is ready
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(160deg, #0f172a 0%, #0d3d38 50%, #0f172a 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300, borderRadius: '50%',
          border: '1px solid rgba(13,148,136,0.15)',
        }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '14px',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(13,148,136,0.4)',
          }}>
            <ShieldIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, letterSpacing: '-0.03em' }}>
            DocShield
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2, textAlign: 'center', maxWidth: 380 }}>
          Recover your account
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 360, lineHeight: 1.7 }}>
          Enter your registered email address and we&apos;ll send you instructions to reset your password.
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          width: { xs: '100%', md: '480px' },
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          p: { xs: 3, md: 5 }, bgcolor: 'white',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>DocShield</Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
            Forgot password?
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            No worries, we&apos;ll send you reset instructions.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {sent && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              If that email is registered, you&apos;ll receive reset instructions shortly.
            </Alert>
          )}

          {!sent && (
            <form onSubmit={handleForgotPassword}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2, py: 1.4, fontSize: '15px',
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/signin" underline="hover" sx={{ color: '#0d9488', fontWeight: 600, fontSize: '14px' }}>
              ← Back to sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
