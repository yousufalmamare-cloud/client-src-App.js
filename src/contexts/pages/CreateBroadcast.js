import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(200, 'Title must be at most 200 characters'),
  message: Yup.string()
    .required('Message is required')
    .max(5000, 'Message must be at most 5000 characters'),
  urgency: Yup.string()
    .oneOf(['low', 'medium', 'high'])
    .required('Urgency is required'),
  type: Yup.string()
    .oneOf(['announcement', 'alert', 'maintenance', 'update', 'news', 'meeting'])
    .required('Type is required')
});

const CreateBroadcast = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      message: '',
      urgency: 'medium',
      type: 'announcement'
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const broadcastData = {
          ...values,
          tags,
          expiryDate: expiryDate ? expiryDate.toISOString() : null
        };

        const res = await axios.post('/api/broadcasts', broadcastData);
        
        toast.success('Broadcast created successfully!');
        navigate(`/broadcasts/${res.data.data._id}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create broadcast');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Please login to create a broadcast
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Broadcast
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={6}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Urgency Level *</InputLabel>
                <Select
                  name="urgency"
                  value={formik.values.urgency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Urgency Level *"
                >
                  <MenuItem value="low">
                    <Chip label="Low" color="success" size="small" /> Low Priority
                  </MenuItem>
                  <MenuItem value="medium">
                    <Chip label="Medium" color="warning" size="small" /> Medium Priority
                  </MenuItem>
                  <MenuItem value="high">
                    <Chip label="High" color="error" size="small" /> High Priority
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type *</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Type *"
                >
                  <MenuItem value="announcement">📢 Announcement</MenuItem>
                  <MenuItem value="alert">⚠️ Alert</MenuItem>
                  <MenuItem value="maintenance">🔧 Maintenance</MenuItem>
                  <MenuItem value="update">🔄 Update</MenuItem>
                  <MenuItem value="news">📰 News</MenuItem>
                  <MenuItem value="meeting">👥 Meeting</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                helperText="Add tags to categorize your broadcast"
              />
              <Box sx={{ mt: 2 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Expiry Date (Optional)"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Set a date when this broadcast should expire automatically
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/broadcasts')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Creating...' : 'Create Broadcast'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateBroadcast;
