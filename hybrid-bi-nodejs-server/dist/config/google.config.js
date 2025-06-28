"use strict";
// import dotenv from 'dotenv';
// dotenv.config(); // In a real app, call this in server.ts or a main config file
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTANT: In a real application, use environment variables for these secrets.
// Do NOT hardcode them like this in production.
// These are placeholders for the sandboxed environment.
const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
    scopes: [
        'https://www.googleapis.com/auth/drive.metadata.readonly', // To list files (spreadsheets)
        'https://www.googleapis.com/auth/spreadsheets.readonly', // To read spreadsheet content
        // 'https://www.googleapis.com/auth/userinfo.email',       // To get user's email (optional)
        // 'https://www.googleapis.com/auth/userinfo.profile',    // To get user's profile (optional)
    ],
};
if (googleConfig.clientId === 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER' || googleConfig.clientSecret === 'YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER') {
    console.warn('\n****************************************************************************************\n' +
        'WARNING: Google OAuth credentials are using placeholders. \n' +
        'Google Authentication will not work until you set up valid credentials in your \n' +
        '.env file (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI) \n' +
        'and ensure GOOGLE_REDIRECT_URI is authorized in your Google Cloud Console.\n' +
        '****************************************************************************************\n');
}
exports.default = googleConfig;
//# sourceMappingURL=google.config.js.map