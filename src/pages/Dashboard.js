// src/pages/Dashboard.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import BargeEntryForm from '../components/BargeEntryForm';
import BargeLogsTable from '../components/BargeLogsTable';
import Layout from '../components/Layout';

const Dashboard = ({ user, onLogout }) => {
  return (
    <Layout user={user} onLogout={onLogout}>
      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Barge Tracking System
        </Typography>

        {(user.role === 'viewer' || user.role === 'god') && (
          <>
            <BargeEntryForm />
            <Box my={4} />
          </>
        )}

        {(user.role === 'admin' || user.role === 'god') && (
          <BargeLogsTable user={user} />
        )}
      </Box>
    </Layout>
  );
};

export default Dashboard;