"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Import the auth routes
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // Backend server port
// CORS Configuration
const allowedOrigins = ['http://localhost:4200', process.env.FRONTEND_URL].filter(Boolean);
console.log("Allowed CORS origins:", allowedOrigins);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            console.warn(`CORS: Origin ${origin} not allowed.`);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true, // If you need to handle cookies or authorization headers
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json()); // Middleware to parse JSON bodies
// Serve static frontend files
const frontendPath = path_1.default.join(__dirname, '../../metabase-ui/build');
app.use(express_1.default.static(frontendPath));
// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Backend server is running' });
});
// Authentication Routes
app.use('/api/auth', auth_routes_1.default);
// Fallback: serve index.html for any non-API route (for SPA routing)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path_1.default.join(frontendPath, 'index.html'));
    }
    else {
        res.status(404).json({ message: 'API route not found' });
    }
});
// Placeholder for future API routes
// Example: app.use('/api/google-sheets', googleSheetsRouter);
// Example: app.use('/api/excel', excelRouter);
// Example: app.use('/api/ai', aiRouter);
// Global error handler (basic)
app.use((err, req, res, next) => {
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
exports.default = app;
//# sourceMappingURL=server.js.map