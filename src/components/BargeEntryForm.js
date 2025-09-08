import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Grid
} from '@mui/material';

const BargeEntryForm = () => {
  const [bargeOptions, setBargeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  const [laborTeamOptions, setLaborTeamOptions] = useState([]);
  const [formData, setFormData] = useState({
    bargeId: '',
    status: '',
    locationId: '',
    arrivalTime: '',
    berthingTime: '',
    castOffTime: '',
    draftIn: '',
    draftOut: '',
    fuelQuantity: '',
    fuelTimestamp: '',
    motherVessel: '',
    supervisorId: '',
    laborTeamId: ''
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [bargesRes, locationsRes, supervisorsRes, laborTeamsRes] = await Promise.all([
          fetch('http://localhost:3001/api/barges'),
          fetch('http://localhost:3001/api/locations'),
          fetch('http://localhost:3001/api/supervisors'),
          fetch('http://localhost:3001/api/labor-teams')
        ]);

        const [barges, locations, supervisors, laborTeams] = await Promise.all([
          bargesRes.json(),
          locationsRes.json(),
          supervisorsRes.json(),
          laborTeamsRes.json()
        ]);

        setBargeOptions(barges);
        setLocationOptions(locations);
        setSupervisorOptions(supervisors);
        setLaborTeamOptions(laborTeams);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/barge-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Entry submitted successfully!');
        console.log('Response:', data);
        setFormData({
          bargeId: '', status: '', locationId: '', arrivalTime: '', berthingTime: '',
          castOffTime: '', draftIn: '', draftOut: '', fuelQuantity: '', fuelTimestamp: '',
          motherVessel: '', supervisorId: '', laborTeamId: ''
        });
      } else {
        alert('Error: ' + data.message);
        console.error(data);
      }
    } catch (err) {
      alert('Network or server error');
      console.error(err);
    }
  };

  const dropdownStyle = { minWidth: 200 };

  return (
    <Box sx={{ maxWidth: '100%', px: 6, py: 4 }}>
      <Typography variant="h5" gutterBottom>Barge Entry Form</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required sx={dropdownStyle}>
              <InputLabel>Barge</InputLabel>
              <Select name="bargeId" value={formData.bargeId} onChange={handleChange}>
                <MenuItem value=""><em>Select</em></MenuItem>
                {bargeOptions.map(barge => (
                  <MenuItem key={barge.id} value={barge.id}>{barge.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required sx={dropdownStyle}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <MenuItem value=""><em>Select</em></MenuItem>
                {['Parked', 'At Port', 'En Route to Mother Vessel', 'At Mother Vessel', 'En Route to Unloading', 'Unloaded'].map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required sx={dropdownStyle}>
              <InputLabel>Location</InputLabel>
              <Select name="locationId" value={formData.locationId} onChange={handleChange}>
                <MenuItem value=""><em>Select</em></MenuItem>
                {locationOptions.map(location => (
                  <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {['arrivalTime', 'berthingTime', 'castOffTime', 'fuelTimestamp'].map((field) => (
            <Grid item xs={12} md={6} key={field}>
              <TextField
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                type="datetime-local"
                value={formData[field]}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ))}

          {['draftIn', 'draftOut', 'fuelQuantity'].map(field => (
            <Grid item xs={12} md={6} key={field}>
              <TextField
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                type="number"
                inputProps={{ step: '0.1' }}
                value={formData[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="motherVessel"
              label="Mother Vessel"
              value={formData.motherVessel}
              onChange={handleChange}
              required
            />
          </Grid>

          {[{ name: 'supervisorId', options: supervisorOptions, label: 'Supervisor' }, { name: 'laborTeamId', options: laborTeamOptions, label: 'Labor Team' }].map(({ name, options, label }) => (
            <Grid item xs={12} md={6} key={name}>
              <FormControl fullWidth sx={dropdownStyle}>
                <InputLabel>{label}</InputLabel>
                <Select name={name} value={formData[name]} onChange={handleChange}>
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {options.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit Entry
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default BargeEntryForm;