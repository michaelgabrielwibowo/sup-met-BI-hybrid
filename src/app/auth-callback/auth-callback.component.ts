import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  // styleUrls: ['./auth-callback.component.scss'] // Add if styling needed
})
export class AuthCallbackComponent implements OnInit {
  message: string = 'Processing authentication...';
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const expiryDate = params['expiry_date']; // This is a timestamp string
      // const idToken = params['id_token']; // Optional

      if (accessToken) {
        this.authService.storeToken(accessToken, expiryDate /*, idToken */);
        this.message = 'Authentication successful! Redirecting...';
        // Redirect to a sensible page, e.g., datasources or workspace
        setTimeout(() => {
          this.router.navigate(['/datasources']);
        }, 1500);
      } else {
        this.error = params['error'] || 'Authentication failed. No token received.';
        this.message = 'Authentication Failed.';
        console.error('OAuth Callback Error:', params['error_description'] || this.error);
        // Optionally, redirect to login or home page after showing error
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      }
    });
  }
}
