import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CardActions
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  AccessTime,
  Person
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const BroadcastCard = ({ broadcast, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this broadcast?')) {
      onDelete && onDelete(broadcast._id);
    }
    handleMenuClose();
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      announcement: '📢',
      alert: '⚠️',
      maintenance: '🔧',
      update: '🔄',
      news: '📰',
      meeting: '👥'
    };
    return icons[type] || '📢';
  };

  const isOwner = user && user.id === broadcast.createdBy?._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <Card sx={{ 
      borderLeft: `4px solid ${
        broadcast.urgency === 'high' ? '#ef4444' : 
        broadcast.urgency === 'medium' ? '#f59e0b' : '#10b981'
      }`,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 4
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component={Link} to={`/broadcasts/${broadcast._id}`} sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': { color: 'primary.main' }
            }}>
              {broadcast.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip 
                label={broadcast.urgency} 
                color={getUrgencyColor(broadcast.urgency)}
                size="small" 
              />
              <Chip 
                label={broadcast.type}
                variant="outlined"
                size="small"
                icon={<span>{getTypeIcon(broadcast.type)}</span>}
              />
            </Box>
          </Box>

          {(isOwner || isAdmin) && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem component={Link} to={`/broadcasts/${broadcast._id}/edit`}>
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {broadcast.message.length > 200 
            ? `${broadcast.message.substring(0, 200)}...` 
            : broadcast.message}
        </Typography>

        {broadcast.tags && broadcast.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {broadcast.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {broadcast.createdBy?.username || 'Unknown'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(broadcast.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {broadcast.views} views
              </Typography>
            </Box>
          </Box>

          {broadcast.expiryDate && (
            <Chip
              label={`Expires ${formatDistanceToNow(new Date(broadcast.expiryDate), { addSuffix: true })}`}
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Button
          size="small"
          component={Link}
          to={`/broadcasts/${broadcast._id}`}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
};

export default BroadcastCard;
