import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Divider
} from '@mui/material';
import { api, type ShortenUrlRequest } from '../api';
import { logInfo, logError } from '../loggerClient';

const ShortenerForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [validity, setValidity] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortLink: string; expiry: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const requestData: ShortenUrlRequest = {
        url: url.trim(),
        validity: validity || 30,
      };

      if (customShortcode.trim()) {
        requestData.shortcode = customShortcode.trim();
      }

      await logInfo('component', 'Attempting to shorten URL', { url: requestData.url });

      const response = await api.shortenUrl(requestData);
      setResult(response);

      await logInfo('component', 'URL shortened successfully', { 
        shortLink: response.shortLink 
      });

      // Reset form
      setUrl('');
      setCustomShortcode('');
      setValidity(30);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      
      await logError('component', 'Failed to shorten URL', { 
        error: errorMessage,
        url: url.trim() 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      await logInfo('component', 'Short link copied to clipboard');
    } catch (err) {
      await logError('component', 'Failed to copy to clipboard', { error: err });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Shorten Your URL
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Enter URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com/very-long-url"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Custom Short Code (optional)"
          value={customShortcode}
          onChange={(e) => setCustomShortcode(e.target.value)}
          placeholder="mycustomcode"
          helperText="3-10 alphanumeric characters. Leave empty for auto-generation."
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="number"
          label="Validity (days)"
          value={validity}
          onChange={(e) => setValidity(parseInt(e.target.value) || 30)}
          inputProps={{ min: 1, max: 365 }}
          helperText="How many days should this short URL be valid?"
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !url.trim()}
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : 'Shorten URL'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Alert severity="success" sx={{ mb: 2 }}>
            URL shortened successfully!
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Your shortened URL:
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Link
                href={result.shortLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ flexGrow: 1, wordBreak: 'break-all' }}
              >
                {result.shortLink}
              </Link>
              
              <Button
                size="small"
                onClick={() => copyToClipboard(result.shortLink)}
              >
                Copy
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Expires: {new Date(result.expiry).toLocaleDateString()}
            </Typography>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default ShortenerForm;
