import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Announcement as AnnouncementIcon,
  Warning as WarningIcon,
  Update as UpdateIcon,
  TrendingUp,
  People,
  AccessTime
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import BroadcastCard from '../components/BroadcastCard';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentBroadcasts, setRecentBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, broadcastsRes] = await Promise.all([
        axios.get('/api/broadcasts/stats/summary'),
        axios.get('/api/broadcasts?limit=5&status=active')
      ]);

      setStats(statsRes.data.data);
      setRecentBroadcasts(broadcastsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to <span style={{ color: '#2563eb' }}>InfoCast</span>
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Your centralized platform for important announcements and alerts
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/broadcasts"
              sx={{ mr: 2 }}
            >
              View Broadcasts
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/create"
            >
              Create Broadcast
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnnouncementIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalBroadcasts[0]?.count || 0}
                  </Typography>
                  <Typography color="text.secondary">Total Broadcasts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.activeBroadcasts[0]?.count || 0}
                  </Typography>
                  <Typography color="text.secondary">Active Now</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UpdateIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.byUrgency?.find(u => u._id === 'high')?.count || 0}
                  </Typography>
                  <Typography color="text.secondary">Urgent Alerts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {recentBroadcasts.length}
                  </Typography>
                  <Typography color="text.secondary">Today</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Broadcasts */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Recent Broadcasts</Typography>
          <Button component={Link} to="/broadcasts" variant="text">
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {recentBroadcasts.map((broadcast, index) => (
            <Grid item xs={12} key={broadcast._id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <BroadcastCard broadcast={broadcast} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {recentBroadcasts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AnnouncementIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No broadcasts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Be the first to create a broadcast!
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Urgency Guide */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Urgency Levels</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '4px solid #10b981' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip label="Low" color="success" size="small" />
                </Box>
                <Typography variant="body2">
                  General information, announcements, and updates that don't require immediate attention.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '4px solid #f59e0b' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip label="Medium" color="warning" size="small" />
                </Box>
                <Typography variant="body2">
                  Important information that requires attention but is not time-critical.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '4px solid #ef4444' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip label="High" color="error" size="small" />
                </Box>
                <Typography variant="body2">
                  Critical alerts that require immediate attention and action.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
