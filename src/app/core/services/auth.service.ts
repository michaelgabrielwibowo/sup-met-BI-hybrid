import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface AuthToken {
  accessToken: string;
  expiryDate?: number; // Timestamp
  // idToken?: string; // Optional, if needed
}

@Injectable({
  providedIn: 'root' // Or provide in CoreModule if you create one
})
export class AuthService {
  private currentTokenSubject = new BehaviorSubject<AuthToken | null>(this.getStoredToken());
  public currentToken$: Observable<AuthToken | null> = this.currentTokenSubject.asObservable();

  private readonly TOKEN_KEY = 'google_auth_token'; // For potential localStorage (not recommended for access tokens)

  constructor() { }

  public get currentTokenValue(): AuthToken | null {
    return this.currentTokenSubject.value;
  }

  public isAuthenticated(): boolean {
    const token = this.currentTokenValue;
    if (!token || !token.accessToken) {
      return false;
    }
    if (token.expiryDate && token.expiryDate <= Date.now()) {
      console.log('Token expired');
      this.clearToken(); // Clear expired token
      return false;
    }
    return true;
  }

  // Called from auth-callback component
  storeToken(accessToken: string, expiryDate?: string, idToken?: string): void {
    const token: AuthToken = { accessToken };
    if (expiryDate) {
      token.expiryDate = parseInt(expiryDate, 10);
    }
    // if (idToken) token.idToken = idToken; // Store if needed

    // For simplicity, storing in sessionStorage.
    // In a real app, consider HttpOnly cookies set by backend for refresh tokens,
    // and access tokens in memory or more secure client storage.
    // Avoid localStorage for access tokens due to XSS risks.
    try {
      sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
    } catch (e) {
      console.error("Error saving token to sessionStorage", e);
      // Fallback to in-memory if sessionStorage is unavailable/full
    }
    this.currentTokenSubject.next(token);
    console.log('Token stored. Expiry:', token.expiryDate ? new Date(token.expiryDate) : 'N/A');
  }

  public getAccessToken(): string | null {
    return this.isAuthenticated() ? this.currentTokenValue!.accessToken : null;
  }

  private getStoredToken(): AuthToken | null {
    try {
      const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
      if (storedToken) {
        const token = JSON.parse(storedToken) as AuthToken;
        // Basic validation
        if (token && token.accessToken) {
           // Check expiry on load
          if (token.expiryDate && token.expiryDate <= Date.now()) {
            sessionStorage.removeItem(this.TOKEN_KEY);
            return null;
          }
          return token;
        }
      }
    } catch (e) {
      console.error("Error retrieving token from sessionStorage", e);
      sessionStorage.removeItem(this.TOKEN_KEY); // Clear corrupted token
    }
    return null;
  }

  clearToken(): void {
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
    } catch (e) {
      console.error("Error removing token from sessionStorage", e);
    }
    this.currentTokenSubject.next(null);
  }

  // This would be the URL on your Node.js backend that starts the Google OAuth flow
  getGoogleAuthUrl(): string {
    // Assuming Node.js backend is running on port 3000
    return 'http://localhost:3000/api/auth/google';
  }

  logout(): void {
    this.clearToken();
    // TODO: Optionally, call a backend endpoint to invalidate server-side session or tokens if applicable
    console.log('User logged out, token cleared.');
  }
}
