# Affordmed — Full-Stack URL Shortener

This is a complete URL shortener application with a TypeScript backend and React frontend, implementing reusable logging middleware for Affordmed evaluation.

## 📁 Project Structure

```
/your-repo-rollno
├── /logging-middleware          # Reusable logging package
│   ├── package.json
│   └── src/index.ts
├── /backend                     # Express microservice
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts            # Main server file
│       ├── store.ts             # In-memory data store
│       ├── shortcode.ts         # URL validation & shortcode generation
│       └── loggerClient.ts      # Backend logging client
├── /frontend                    # React application
│   ├── package.json
│   └── src/
│       ├── App.tsx              # Main app with tabs
│       ├── index.tsx            # React entry point
│       ├── api.ts               # API service layer
│       ├── loggerClient.ts      # Frontend logging client
│       └── components/
│           ├── ShortenerForm.tsx # URL shortening form
│           └── StatsPage.tsx     # Statistics page
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Running

1. **Clone and navigate to project:**
   ```bash
   git clone <your-repo>
   cd your-repo-rollno
   ```

2. **Install dependencies for all packages:**
   ```bash
   # Logging middleware
   cd logging-middleware
   npm install

   # Backend
   cd ../backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Start the backend server (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

4. **Start the frontend server (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or next available port)

## 🎯 Features

### Core Functionality
- ✅ **URL Shortening**: Convert long URLs to short codes
- ✅ **Custom Shortcodes**: Optional custom short codes (3-10 alphanumeric)
- ✅ **Expiry Management**: Configurable validity period (default 30 days)
- ✅ **Click Tracking**: Track number of clicks on shortened URLs
- ✅ **Statistics**: View original URL, expiry, and click count
- ✅ **Redirect Service**: Automatic redirect to original URLs

### Technical Features
- ✅ **Material UI**: Modern, responsive React interface
- ✅ **TypeScript**: Full type safety across frontend and backend
- ✅ **In-Memory Store**: Fast, temporary data storage
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Logging Middleware**: Reusable logging system for Affordmed API
- ✅ **CORS Support**: Cross-origin requests enabled
- ✅ **Input Validation**: URL and shortcode validation

## 🔌 API Endpoints

### Backend (http://localhost:5000)

#### Create Short URL
```http
POST /shorturls
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",
  "validity": 30,           // Optional: days (default: 30)
  "shortcode": "custom123"  // Optional: custom shortcode
}

Response:
{
  "shortLink": "http://localhost:5000/abc123",
  "expiry": "2024-02-03T10:30:00.000Z"
}
```

#### Get URL Statistics
```http
GET /shorturls/:code

Response:
{
  "originalUrl": "https://example.com/very-long-url",
  "expiry": "2024-02-03T10:30:00.000Z",
  "clicks": 5,
  "createdAt": "2024-01-04T10:30:00.000Z"
}
```

#### Redirect to Original URL
```http
GET /:code
# Redirects to original URL and increments click count
```

#### Health Check
```http
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2024-01-04T10:30:00.000Z"
}
```

## 🎨 Frontend Interface

The React frontend provides a clean, tabbed interface:

### Tab 1: "Shorten URL"
- URL input field with validation
- Optional custom shortcode input
- Validity period selection (days)
- Success display with copyable short link
- Error handling with user-friendly messages

### Tab 2: "Statistics" 
- Shortcode input field
- Display original URL, click count, creation date, expiry
- Status indicators (Active/Expired)
- Error handling for invalid/expired codes

## 📊 Data Storage

**Note**: This implementation uses **in-memory storage** (Map) for demonstration purposes. Data will be lost when the server restarts.

For production or persistent evaluation, replace with:
- SQLite for simple file-based storage
- PostgreSQL/MySQL for robust relational data
- MongoDB for document-based storage

## 🔐 Logging Middleware

The reusable logging middleware (`logging-middleware/src/index.ts`) provides:

- **Structured Logging**: Stack, level, package, message, metadata
- **Authentication**: Token-based auth with Affordmed API
- **Validation**: Enforces allowed packages per stack (frontend/backend)
- **Fire-and-Forget**: Non-blocking, resilient logging
- **Token Management**: Automatic token refresh

### Usage Example:
```typescript
import { Log } from '../logging-middleware/src/index';

await Log('backend', 'info', 'route', 'URL shortened successfully', {
  shortcode: 'abc123',
  originalUrl: 'https://example.com'
});
```

## 🧪 Testing & Evaluation

### Manual Testing Workflow:

1. **Start both servers** (backend:5000, frontend:5173)

2. **Test URL Shortening:**
   - Go to "Shorten URL" tab
   - Enter: `https://www.google.com`
   - Optional: Custom code `test123`
   - Click "Shorten URL"
   - ✅ Verify short link is generated
   - ✅ Click the short link to test redirect

3. **Test Statistics:**
   - Go to "Statistics" tab
   - Enter the shortcode from step 2
   - Click "Get Statistics"
   - ✅ Verify original URL, click count, dates

4. **Test Error Handling:**
   - Try invalid URL: `not-a-url`
   - Try duplicate custom shortcode
   - Try non-existent shortcode in stats
   - ✅ Verify proper error messages

5. **Test Edge Cases:**
   - Very long URLs
   - Special characters in URLs
   - Expired URLs (set validity to 0 days)

### Screenshots to Capture:
1. Frontend home page with both tabs
2. URL shortening form with successful result
3. Statistics page showing URL details
4. Error message examples
5. Backend console showing server logs
6. Network tab showing API calls

## 🔧 Development Notes

### Backend Dependencies:
- `express`: Web framework
- `cors`: Cross-origin requests
- `typescript`, `ts-node`: TypeScript support
- `node-fetch`: HTTP requests for logging

### Frontend Dependencies:
- `react`, `react-dom`: React framework
- `@mui/material`, `@mui/icons-material`: Material UI components
- `axios`: HTTP client
- `typescript`: Type safety

### Environment Configuration:
- Backend Port: `5000` (configurable via PORT env var)
- Frontend Port: `5173` (auto-assigned by Vite)
- Logging URL: `http://20.244.56.144/evaluation-service/logs`
- Auth URL: `http://20.244.56.144/evaluation-service/auth`

## 🚨 Production Considerations

For production deployment:

1. **Database**: Replace in-memory store with persistent database
2. **Authentication**: Implement proper user authentication
3. **Rate Limiting**: Add rate limiting for API endpoints
4. **Caching**: Add Redis for caching frequently accessed URLs
5. **Monitoring**: Enhanced logging and monitoring
6. **SSL**: HTTPS for production URLs
7. **Environment Variables**: Proper config management
8. **Error Boundaries**: React error boundaries for better UX

## 📝 License

This project is created for Affordmed evaluation purposes.

---

**Note**: This implementation prioritizes functionality and code quality for evaluation. The in-memory storage is intentional for quick setup and demonstration.
