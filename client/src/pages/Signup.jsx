import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Link, CircularProgress,
  InputAdornment, Divider, Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  SaveAlt as SaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const SignUpPage = () => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldError('');
  };

  const downloadPrivateKey = (privateKey) => {
    const element = document.createElement('a');
    const file = new Blob([privateKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'private_key.pem';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !confirmPassword) {
      setFieldError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setFieldError('Please enter a valid email address.');
      return;
    }
    if (formData.password !== confirmPassword) {
      setFieldError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/api/user/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        downloadPrivateKey(data.private_key);
        toast.success('Account created!', { duration: 1500 });
        toast('Save your private key — it will not be shown again!', { duration: 4000 });
        setTimeout(() => navigate('/signin'), 1600);
      } else {
        setFieldError(data.error || 'Something went wrong, please try again.');
        toast.error(data.error || 'Sign up failed', { duration: 1500 });
      }
    } catch {
      setFieldError('Something went wrong, please try again.');
      toast.error('Sign up failed', { duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left branding panel */}
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
        <Box sx={{
          position: 'absolute', bottom: -120, left: -60,
          width: 400, height: 400, borderRadius: '50%',
          border: '1px solid rgba(13,148,136,0.1)',
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
          Join thousands of professionals
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 360, lineHeight: 1.7 }}>
          Your trusted platform for secure document transfer. A unique key pair is generated for you — keep your private key safe!
        </Typography>

        <Box
          sx={{
            mt: 5, p: 3, borderRadius: '14px',
            bgcolor: 'rgba(13,148,136,0.1)',
            border: '1px solid rgba(13,148,136,0.2)',
            maxWidth: 360, width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SaveIcon sx={{ color: '#5eead4' }} />
            <Typography sx={{ color: '#5eead4', fontWeight: 600, fontSize: '14px' }}>
              Important: Save your private key
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', mt: 1, lineHeight: 1.6 }}>
            Your private key will be downloaded automatically. Store it securely — it&apos;s required to sign and send documents.
          </Typography>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          width: { xs: '100%', md: '520px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 5 },
          bgcolor: 'white',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
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
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            Get started with DocShield for free
          </Typography>

          {fieldError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {fieldError}
            </Alert>
          )}

          <form onSubmit={handleSignUp}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                label="First name"
                name="first_name"
                fullWidth
                margin="dense"
                value={formData.first_name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Last name"
                name="last_name"
                fullWidth
                margin="dense"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Box>
            <TextField
              label="Email address"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
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
                mt: 2.5, py: 1.4, fontSize: '15px',
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/signin" underline="hover" sx={{ color: '#0d9488', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>

      <Toaster position="top-center" />
    </Box>
  );
};

export default SignUpPage;
