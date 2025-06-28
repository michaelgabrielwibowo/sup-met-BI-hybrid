import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import authRoutes from './routes/auth.routes'; // Import the auth routes

import path from 'path';

const app: Express = express();
const PORT = process.env.PORT || 3000; // Backend server port

// CORS Configuration
const allowedOrigins = ['http://localhost:4200', process.env.FRONTEND_URL].filter(Boolean) as string[];
console.log("Allowed CORS origins:", allowedOrigins)

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origin ${origin} not allowed.`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // If you need to handle cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

// Serve static frontend files
const frontendPath = path.join(__dirname, '../../metabase-ui/build');
app.use(express.static(frontendPath));

// Basic Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Backend server is running' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Fallback: serve index.html for any non-API route (for SPA routing)
app.get('*', (req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({ message: 'API route not found' });
  }
});


// Placeholder for future API routes
// Example: app.use('/api/google-sheets', googleSheetsRouter);
// Example: app.use('/api/excel', excelRouter);
// Example: app.use('/api/ai', aiRouter);

// Global error handler (basic)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  // Check if the error is a CORS error from our custom origin function
  if (err.message.includes("not allowed by CORS") || err.message.includes("Origin http://localhost:4200 not allowed by CORS")) {
    return res.status(403).json({ message: 'CORS Error: Access Denied', error: err.message });
  }
  res.status(500).json({ message: 'Something went wrong on the server!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`[server]: Backend server is running at http://localhost:${PORT}`);
});

// Export the app for potential testing or other uses (though not strictly necessary for basic setup)
export default app;
