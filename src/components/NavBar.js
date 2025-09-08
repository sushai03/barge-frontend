// src/components/NavBar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Barge Tracker
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body1">
            Logged in as <strong>{user.username}</strong> (<em>{user.role}</em>)
          </Typography>

          {user.role === 'god' && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/user-management')}
            >
              ⚙️ Manage Users
            </Button>
          )}

          <Button color="inherit" onClick={onLogout}>
            🔓 Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;