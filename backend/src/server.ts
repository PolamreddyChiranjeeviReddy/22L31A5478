// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import { urlStore, ShortUrl } from './store';
import { generateShortcode, isValidUrl, isValidShortcode } from './shortcode';
import { logInfo, logError } from './loggerClient';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST /shorturls - Create short URL
app.post('/shorturls', async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      await logError('route', 'Invalid URL provided', { url });
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    // Validate custom shortcode if provided
    if (shortcode && !isValidShortcode(shortcode)) {
      await logError('route', 'Invalid shortcode format', { shortcode });
      return res.status(400).json({ error: 'Invalid shortcode format (3-10 alphanumeric chars)' });
    }

    // Check if custom shortcode already exists
    if (shortcode && urlStore.getByShortcode(shortcode)) {
      await logError('route', 'Shortcode already exists', { shortcode });
      return res.status(400).json({ error: 'Shortcode already exists' });
    }

    // Generate shortcode if not provided
    let finalShortcode = shortcode;
    if (!finalShortcode) {
      do {
        finalShortcode = generateShortcode();
      } while (urlStore.getByShortcode(finalShortcode));
    }

    // Calculate expiry (default 30 days)
    const validityDays = validity || 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + validityDays);

    // Create short URL entry
    const shortUrl: ShortUrl = {
      id: Math.random().toString(36).substr(2, 9),
      originalUrl: url,
      shortcode: finalShortcode,
      expiry,
      createdAt: new Date(),
      clicks: 0
    };

    urlStore.create(shortUrl);

    const shortLink = `http://localhost:${PORT}/${finalShortcode}`;
    
    await logInfo('route', 'Short URL created successfully', { 
      shortcode: finalShortcode, 
      originalUrl: url 
    });

    res.json({ shortLink, expiry });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logError('route', 'Error creating short URL', { error: errorMessage });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /shorturls/:code - Get original URL and stats
app.get('/shorturls/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const shortUrl = urlStore.getByShortcode(code);

    if (!shortUrl) {
      await logError('route', 'Short URL not found', { code });
      return res.status(404).json({ error: 'Short URL not found' });
    }

    if (urlStore.isExpired(shortUrl)) {
      await logError('route', 'Short URL has expired', { code });
      return res.status(410).json({ error: 'Short URL has expired' });
    }

    await logInfo('route', 'Short URL stats retrieved', { code });
    res.json({ 
      originalUrl: shortUrl.originalUrl, 
      expiry: shortUrl.expiry,
      clicks: shortUrl.clicks,
      createdAt: shortUrl.createdAt
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logError('route', 'Error retrieving URL stats', { error: errorMessage });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:code - Redirect to original URL
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Skip favicon requests
    if (code === 'favicon.ico') {
      return res.status(404).end();
    }

    const shortUrl = urlStore.getByShortcode(code);

    if (!shortUrl) {
      await logError('route', 'Short URL not found for redirect', { code });
      return res.status(404).json({ error: 'Short URL not found' });
    }

    if (urlStore.isExpired(shortUrl)) {
      await logError('route', 'Short URL has expired for redirect', { code });
      return res.status(410).json({ error: 'Short URL has expired' });
    }

    // Increment click count
    urlStore.incrementClick(code);

    await logInfo('route', 'Redirecting to original URL', { 
      code, 
      originalUrl: shortUrl.originalUrl 
    });

    res.redirect(shortUrl.originalUrl);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logError('route', 'Error during redirect', { error: errorMessage });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  logInfo('service', `Server started on port ${PORT}`);
});
