import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { api, type UrlStatsResponse } from '../api';
import { logInfo, logError } from '../loggerClient';

const StatsPage: React.FC = () => {
  const [shortcode, setShortcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UrlStatsResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcode.trim()) return;

    setLoading(true);
    setError('');
    setStats(null);

    try {
      await logInfo('component', 'Fetching URL statistics', { shortcode: shortcode.trim() });

      const response = await api.getUrlStats(shortcode.trim());
      setStats(response);

      await logInfo('component', 'URL statistics retrieved successfully', { 
        shortcode: shortcode.trim(),
        clicks: response.clicks 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      
      await logError('component', 'Failed to fetch URL statistics', { 
        error: errorMessage,
        shortcode: shortcode.trim() 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isExpired = (expiryString: string) => {
    return new Date() > new Date(expiryString);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        URL Statistics
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Enter Short Code"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          required
          placeholder="abc123"
          helperText="Enter the short code from your shortened URL (e.g., 'abc123' from 'localhost:5000/abc123')"
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !shortcode.trim()}
          size="large"
        >
          {loading ? 'Fetching...' : 'Get Statistics'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Statistics for: {shortcode}
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Original URL
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-all',
                  mb: 2,
                  p: 1,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1
                }}
              >
                {stats.originalUrl}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`${stats.clicks} clicks`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={isExpired(stats.expiry) ? 'Expired' : 'Active'} 
                  color={isExpired(stats.expiry) ? 'error' : 'success'} 
                  variant="outlined" 
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {formatDate(stats.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Expires:</strong> {formatDate(stats.expiry)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );
};

export default StatsPage;
