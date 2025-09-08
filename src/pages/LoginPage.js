// src/pages/LoginPage.js
import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm';
import Layout from '../components/Layout'; // Import Layout

const LoginPage = ({ onLogin }) => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Barge Tracker Login
            </Typography>
            <LoginForm onLogin={onLogin} />
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage;