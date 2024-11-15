import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Chip, IconButton,
  CircularProgress, Divider, Alert, InputAdornment, Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  PersonSearch as PersonSearchIcon,
  UploadFile as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  FilePresent as FileIcon,
  Close as CloseIcon,
  PersonOff as PersonOffIcon,
  Title as TitleIcon,
  Key as KeyIcon,
  LinkOff as LinkOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import io from 'socket.io-client';
import DashboardLayout from '../layouts/DashboardLayout';
import digitallySign from '../security/digitallySign.js';
import encrypt from '../security/encrypt.js';
import { retriveUserID } from '../middlewares/RetriveUserID.js';

const Compose = () => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [docName, setDocName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [signatureBase64Data, setSignatureBase64Data] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [senderEmail, setSenderEmail] = useState(null);
  const [recieversPublicKey, setRecieversPublicKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sending, setSending] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const fileInputRef = useRef(null);

  // Auth check
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await retriveUserID();
        if (response.user) {
          setSenderEmail(response.email);
        } else {
          navigate('/signin');
        }
      } catch {
        navigate('/signin');
      }
    };
    checkUserAuth();
  }, []);

  // Socket setup
  useEffect(() => {
    const socketIo = io(serverURL, { transports: ['websocket'] });
    setSocket(socketIo);

    socketIo.on('message', (msg) => {
      if (msg?.publicKey) setRecieversPublicKey(msg.publicKey);
      if (msg?.firstName && msg?.lastName) {
        setFirstName(msg.firstName);
        setLastName(msg.lastName);
      }
    });

    socketIo.on('fileStatus', (status) => {
      if (status.success) {
        toast.success(status.message || 'Document delivered!', { duration: 3000 });
      } else {
        toast.error('File processing failed.', { duration: 2000 });
      }
    });

    socketIo.on('error', (errorMessage) => {
      toast.error(errorMessage, { duration: 2000 });
    });

    return () => socketIo.disconnect();
  }, [serverURL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Only PDF files are accepted.');
    }
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a receiver ID.');
      return;
    }
    if (socket) {
      setConnecting(true);
      socket.emit('joinRoom', roomId);
      setTimeout(() => {
        setIsConnected(true);
        setConnecting(false);
      }, 800);
    }
  };

  const unjoinRoom = () => {
    setIsConnected(false);
    setFirstName('');
    setLastName('');
    setRecieversPublicKey('');
  };

  const sendFile = async () => {
    if (!roomId.trim()) {
      toast.error('Please connect to a recipient first.');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a PDF file.');
      return;
    }
    if (!docName.trim()) {
      toast.error('Please enter a document title.');
      return;
    }
    if (!privateKeyPem.trim()) {
      toast.error('Please enter your private key.');
      return;
    }
    if (socket) {
      setSending(true);
      try {
        const signatureBase64 = await digitallySign(selectedFile, privateKeyPem);
        setSignatureBase64Data(signatureBase64);
        const encrypted = await encrypt(selectedFile, signatureBase64, recieversPublicKey);
        setEncryptedFile(encrypted);
      } catch {
        toast.error('Error signing file. Check your private key.', { duration: 2000 });
        setSending(false);
      }
    } else {
      toast.error('Socket connection not established.');
    }
  };

  // Send file bundle once encrypted
  useEffect(() => {
    if (encryptedFile && roomId && socket) {
      const fileBundle = {
        encryptedFile,
        signatureData: signatureBase64Data,
        name: docName,
        email: roomId,
        sender: senderEmail,
      };
      socket.emit('file', fileBundle, roomId);
      toast.success('Document sent successfully!', { duration: 2500 });
      setSending(false);
      setEncryptedFile(null);
    }
  }, [encryptedFile]);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout
      title="Compose"
      subtitle="Sign and send documents securely"
      userEmail={senderEmail}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>

        {/* Step 1 — Connect */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: '16px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              bgcolor: isConnected ? 'rgba(34,197,94,0.1)' : 'rgba(13,148,136,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: isConnected ? '#16a34a' : '#0d9488' }}>1</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>
              Connect with Recipient
            </Typography>
            {isConnected && (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                label="Connected"
                size="small"
                sx={{ ml: 1, bgcolor: 'rgba(34,197,94,0.1)', color: '#16a34a', fontWeight: 600, fontSize: '11px' }}
              />
            )}
          </Box>

          {!isConnected ? (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <TextField
                placeholder="Enter recipient's email / room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonSearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={joinRoom}
                disabled={connecting}
                sx={{
                  px: 3, py: 1, whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  flexShrink: 0,
                }}
              >
                {connecting ? <CircularProgress size={16} color="inherit" /> : 'Connect'}
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 2, borderRadius: '12px',
                bgcolor: 'rgba(34,197,94,0.05)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>
                  {firstName ? firstName.charAt(0).toUpperCase() : roomId.charAt(0).toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>
                  {firstName && lastName ? `${firstName} ${lastName}` : roomId}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '12px' }}>{roomId}</Typography>
              </Box>
              <Tooltip title="Disconnect">
                <IconButton
                  size="small"
                  onClick={unjoinRoom}
                  sx={{
                    color: '#ef4444',
                    '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                  }}
                >
                  <LinkOffIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Paper>

        {/* Step 2 — Upload document */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: '16px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              bgcolor: selectedFile ? 'rgba(34,197,94,0.1)' : 'rgba(13,148,136,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: selectedFile ? '#16a34a' : '#0d9488' }}>2</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>
              Upload Document
            </Typography>
          </Box>

          {/* Drop zone */}
          {!selectedFile ? (
            <Box
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#0d9488',
                  bgcolor: 'rgba(13,148,136,0.03)',
                },
              }}
            >
              <UploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
              <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                Drop your PDF here, or click to browse
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '13px' }}>
                Only PDF files are accepted
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 2, borderRadius: '12px',
                bgcolor: 'rgba(13,148,136,0.05)',
                border: '1px solid rgba(13,148,136,0.2)',
              }}
            >
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  bgcolor: 'rgba(13,148,136,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileIcon sx={{ color: '#0d9488', fontSize: 24 }} />
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography
                  sx={{
                    fontWeight: 600, color: '#1e293b', fontSize: '14px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '12px' }}>
                  {formatBytes(selectedFile.size)}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Paper>

        {/* Step 3 — Document info + key */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: '16px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '8px',
              bgcolor: 'rgba(13,148,136,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0d9488' }}>3</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>
              Document Details
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Document title"
              placeholder="e.g. Contract Agreement 2025"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Your private key"
              placeholder="Paste your .pem private key"
              value={privateKeyPem}
              onChange={(e) => setPrivateKeyPem(e.target.value)}
              fullWidth
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>

        {/* Send button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={sendFile}
            disabled={sending}
            endIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            sx={{
              px: 4, py: 1.5, fontSize: '15px',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              boxShadow: '0 4px 14px rgba(13,148,136,0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(13,148,136,0.5)',
              },
            }}
          >
            {sending ? 'Sending…' : 'Send Document'}
          </Button>
        </Box>
      </Box>

      <Toaster position="top-center" />
    </DashboardLayout>
  );
};

export default Compose;
