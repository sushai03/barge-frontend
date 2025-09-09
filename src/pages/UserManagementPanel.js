// src/pages/UserManagementPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid
} from '@mui/material';
import Layout from '../components/Layout';

const BACKEND_URL = 'https://barge-backend.onrender.com';

const UserManagementPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'viewer' });
  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('[ERROR] Failed to fetch users:', err);
      setError('❌ Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/users`, newUser);
      setNewUser({ username: '', password: '', role: 'viewer' });
      setMessage('✅ User added successfully');
      setError(null);
      fetchUsers();
    } catch (err) {
      console.error('[ERROR] Failed to add user:', err);
      setError('❌ Failed to add user');
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditRole(user.role);
    setEditPassword('');
    setMessage('');
    setError(null);
  };

  const handleUpdateUser = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/users/${id}`, {
        role: editRole,
        password: editPassword || undefined,
      });
      setMessage('✅ User updated');
      setError(null);
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('[ERROR] Failed to update user:', err);
      setError('❌ Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/users/${id}`);
      setMessage('🗑️ User deleted');
      setError(null);
      fetchUsers();
    } catch (err) {
      console.error('[ERROR] Failed to delete user:', err);
      setError('❌ Failed to delete user');
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: '100%', px: 6, py: 4 }}>
        <Typography variant="h4" gutterBottom>User Management Panel</Typography>

        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          🔙 Back to Dashboard
        </Button>

        {message && <Typography color="green">{message}</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <Typography variant="h6" sx={{ mt: 3 }}>Existing Users</Typography>
        <TableContainer component={Paper} sx={{ my: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>
                    {editUserId === u.id ? (
                      <Select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="viewer">viewer</MenuItem>
                        <MenuItem value="admin">admin</MenuItem>
                        <MenuItem value="god">god</MenuItem>
                      </Select>
                    ) : (
                      u.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === u.id ? (
                      <Box display="flex" gap={1}>
                        <TextField
                          size="small"
                          type="password"
                          placeholder="New password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleUpdateUser(u.id)}
                        >
                          💾 Save
                        </Button>
                      </Box>
                    ) : (
                      <Button size="small" onClick={() => handleEdit(u)}>✏️ Edit</Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      🗑️ Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ mt: 4 }}>Add New User</Typography>
        <Box component="form" onSubmit={handleAddUser} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={newUser.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                name="role"
                value={newUser.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="viewer">viewer</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="god">god</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">
                ➕ Add User
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default UserManagementPanel;