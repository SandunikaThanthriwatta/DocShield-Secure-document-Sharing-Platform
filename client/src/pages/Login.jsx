import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Link, CircularProgress,
  InputAdornment, IconButton, Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
  CheckCircleOutline as CheckIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const features = [
  'End-to-end encrypted document transfer',
  'Digital signature verification',
  'Two-factor OTP authentication',
  'Real-time secure delivery',
];

const LoginPage = () => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/api/user/signin-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (response.ok) {
        const OTPresponse = await fetch(`${serverURL}/api/user/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include',
        });
        setOtpStep(true);
        if (OTPresponse.ok) {
          toast.success('OTP sent to your email!', { duration: 5500 });
        } else {
          const errorData = await OTPresponse.json();
          toast.error(errorData.error || 'Failed to send OTP', { duration: 1500 });
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Sign-in failed', { duration: 1500 });
      }
    } catch {
      toast.error('An error occurred. Please try again.', { duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/api/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Signed in successfully!', { duration: 1500 });
        setTimeout(() => navigate('/compose'), 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'OTP verification failed', { duration: 1500 });
      }
    } catch {
      toast.error('An error occurred. Please try again.', { duration: 1500 });
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
        {/* Decorative circles */}
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

        {/* Logo */}
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

        <Typography
          variant="h5"
          sx={{ color: 'white', fontWeight: 700, mb: 1.5, textAlign: 'center', maxWidth: 380 }}
        >
          Secure Document Transfer, Simplified
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 360, mb: 5, lineHeight: 1.7 }}
        >
          Send, sign, and verify sensitive documents with confidence. Built for professionals who value privacy.
        </Typography>

        {/* Feature list */}
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          {features.map((f) => (
            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <CheckIcon sx={{ color: '#5eead4', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>{f}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          width: { xs: '100%', md: '480px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 5 },
          bgcolor: 'white',
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
            {otpStep ? 'Check your email' : 'Welcome back'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
            {otpStep
              ? `We sent a 6-digit code to ${email}`
              : 'Sign in to your DocShield account'}
          </Typography>

          {!otpStep ? (
            <form onSubmit={handleLogin}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ textAlign: 'right', mt: 0.5, mb: 1 }}>
                <Link href="/forgotpw" underline="hover" sx={{ color: '#0d9488', fontSize: '13px' }}>
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, py: 1.4, fontSize: '15px', background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerification}>
              <TextField
                label="6-digit OTP"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', fontSize: '20px', textAlign: 'center' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2, py: 1.4, fontSize: '15px', background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Verify OTP'}
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={() => setOtpStep(false)}
                sx={{ mt: 1, color: '#64748b' }}
              >
                Back to login
              </Button>
            </form>
          )}

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" underline="hover" sx={{ color: '#0d9488', fontWeight: 600 }}>
              Create account
            </Link>
          </Typography>
        </Box>
      </Box>

      <Toaster position="top-center" />
    </Box>
  );
};

export default LoginPage;
