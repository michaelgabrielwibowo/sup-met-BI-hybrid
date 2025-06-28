"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleapis_1 = require("googleapis");
const google_config_1 = __importDefault(require("../config/google.config"));
const router = (0, express_1.Router)();
const oauth2Client = new googleapis_1.google.auth.OAuth2(google_config_1.default.clientId, google_config_1.default.clientSecret, google_config_1.default.redirectUri);
// In-memory store for refresh tokens (for simulation only!)
// In a real app, store this securely, e.g., in a database, encrypted.
const userRefreshTokens = {};
// Step 1: Redirect to Google's consent screen
router.get('/google', (req, res) => {
    if (google_config_1.default.clientId === 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER') {
        return res.status(500).send('Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI environment variables.');
    }
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'offline' gets a refresh token
        scope: google_config_1.default.scopes,
        prompt: 'consent', // Force consent screen every time, useful for dev. Remove for prod.
    });
    res.redirect(authUrl);
});
// Step 2: Handle the callback from Google
router.get('/google/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Authorization code missing.');
    }
    try {
        const { tokens } = await oauth2Client.getToken(code);
        // oauth2Client.setCredentials(tokens); // Set credentials for this specific client instance
        // IMPORTANT: Securely store the refresh_token for the user
        // For this simulation, we'll use an in-memory object.
        // A real app needs a proper user session management and secure refresh token storage.
        if (tokens.refresh_token) {
            // Simulate associating refresh token with a user ID (e.g., from your app's own auth system)
            // For now, just store it. If you had user accounts in this app, you'd link it here.
            const pseudoUserId = 'user_abc_123'; // Replace with actual user ID logic
            userRefreshTokens[pseudoUserId] = tokens.refresh_token;
            console.log(`Refresh token stored for user ${pseudoUserId}: ${tokens.refresh_token}`);
        }
        else {
            console.warn('No refresh token received. This might happen if user has already granted offline access and prompt:consent is not used, or if access_type is not offline.');
        }
        // Send access_token and expiry_date to the client.
        // The client should ideally store this in memory for the session.
        // The refresh_token should NOT be sent to the client directly for security reasons
        // unless you have a very specific reason and understand the risks.
        // The client will use the access_token for API calls.
        // If the access_token expires, the client would (ideally) have a mechanism
        // to request a new one from this backend, which would use the refresh_token.
        // For simplicity in this step, redirecting to frontend with tokens in query params.
        // This is NOT recommended for production due to security risks (token leakage in URL/history).
        // A better approach: server sets an HttpOnly cookie for session or returns tokens in response body
        // for client to store in memory / secure storage.
        const queryParams = new URLSearchParams();
        queryParams.append('access_token', tokens.access_token || '');
        if (tokens.expiry_date) {
            queryParams.append('expiry_date', tokens.expiry_date.toString());
        }
        // queryParams.append('id_token', tokens.id_token || ''); // If you need user info from ID token
        // Redirect back to the frontend application
        res.redirect(`${google_config_1.default.frontendUrl}/auth/callback?${queryParams.toString()}`);
    }
    catch (error) {
        console.error('Error exchanging authorization code for tokens:', error);
        res.status(500).send('Failed to authenticate with Google.');
    }
});
// (Optional) Endpoint to get user info - for testing if token works
router.get('/google/userinfo', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    if (!accessToken) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    try {
        // It's better to use the oauth2Client that has credentials set,
        // or create a new one and set credentials.
        const tempOauth2Client = new googleapis_1.google.auth.OAuth2();
        tempOauth2Client.setCredentials({ access_token: accessToken });
        const oauth2 = googleapis_1.google.oauth2({
            auth: tempOauth2Client,
            version: 'v2'
        });
        const { data } = await oauth2.userinfo.get();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching user info:', error.message);
        res.status(401).json({ message: 'Failed to fetch user info, token might be invalid or expired.', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map