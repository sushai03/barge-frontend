import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const BASE_URL = 'https://barge-backend.onrender.com';

const BargeLogsTable = ({ user }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/barge-logs`);
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Error fetching logs:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatTimestamp = (value) => {
    return value ? new Date(value).toLocaleString() : '—';
  };

  const handleDownloadExcel = () => {
    const exportData = logs.map((log) => ({
      ID: log.id,
      Barge: log.barge_name || log.barge_id || '—',
      Status: log.status || '—',
      Location: log.location_name || log.location_id || '—',
      Arrival: formatTimestamp(log.arrival_time),
      Berthing: formatTimestamp(log.berthing_time),
      'Cast-Off': formatTimestamp(log.cast_off_time),
      'Draft In': log.draft_in ?? '—',
      'Draft Out': log.draft_out ?? '—',
      'Fuel Qty': log.fuel_quantity ?? '—',
      'Fuel Time': formatTimestamp(log.fuel_timestamp),
      'Mother Vessel': log.mother_vessel || '—',
      Supervisor: log.supervisor_name || log.supervisor_id || '—',
      'Labor Team': log.labor_team_name || log.labor_team_id || '—'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Barge Logs');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'barge_logs.xlsx');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!logs.length) {
    return (
      <Typography variant="body1" align="center" mt={4}>
        No barge entries found.
      </Typography>
    );
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'barge', headerName: 'Barge', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'location', headerName: 'Location', width: 130 },
    { field: 'arrival', headerName: 'Arrival', width: 160 },
    { field: 'berthing', headerName: 'Berthing', width: 160 },
    { field: 'castOff', headerName: 'Cast-Off', width: 160 },
    { field: 'draftIn', headerName: 'Draft In', width: 100 },
    { field: 'draftOut', headerName: 'Draft Out', width: 100 },
    { field: 'fuelQty', headerName: 'Fuel Qty', width: 100 },
    { field: 'fuelTime', headerName: 'Fuel Time', width: 160 },
    { field: 'motherVessel', headerName: 'Mother Vessel', width: 130 },
    { field: 'supervisor', headerName: 'Supervisor', width: 130 },
    { field: 'laborTeam', headerName: 'Labor Team', width: 130 }
  ];

  const rows = logs.map((log) => ({
    id: log.id,
    barge: log.barge_name || log.barge_id || '—',
    status: log.status || '—',
    location: log.location_name || log.location_id || '—',
    arrival: formatTimestamp(log.arrival_time),
    berthing: formatTimestamp(log.berthing_time),
    castOff: formatTimestamp(log.cast_off_time),
    draftIn: log.draft_in ?? '—',
    draftOut: log.draft_out ?? '—',
    fuelQty: log.fuel_quantity ?? '—',
    fuelTime: formatTimestamp(log.fuel_timestamp),
    motherVessel: log.mother_vessel || '—',
    supervisor: log.supervisor_name || log.supervisor_id || '—',
    laborTeam: log.labor_team_name || log.labor_team_id || '—'
  }));

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Barge Logs</Typography>

      {(user?.role === 'admin' || user?.role === 'god') && (
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={handleDownloadExcel}>
            📥 Download Excel
          </Button>
        </Box>
      )}

      <Paper elevation={3}>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableRowSelectionOnClick
          />
        </div>
      </Paper>
    </Box>
  );
};

export default BargeLogsTable;