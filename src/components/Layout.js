// src/components/Layout.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Layout = ({ user, onLogout, children }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Barge Tracking System
          </Typography>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>
                ✅ {user.username} ({user.role})
              </Typography>

              {user.role === 'god' && (
                <Button color="inherit" onClick={() => navigate('/user-management')}>
                  ⚙️ Manage Users
                </Button>
              )}

              <Button color="inherit" onClick={onLogout}>
                🔓 Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>{children}</Box>
    </Box>
  );
};

export default Layout;