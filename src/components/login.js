import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login({ setUser }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 8 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
           Welcome to the All in One Messaging App
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sign in with Google to start chatting!
        </Typography>
      </Box>
      <Button 
        variant="contained"
        color="primary"
        size="large"
        onClick={handleLogin}
      >
        Login with Google
      </Button>
    </Container>
  );
}

export default Login;
