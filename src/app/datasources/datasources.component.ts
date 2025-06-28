import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-datasources',
  templateUrl: './datasources.component.html',
  styleUrls: ['./datasources.component.scss']
})
export class DatasourcesComponent {
  constructor(public authService: AuthService, private snackBar: MatSnackBar) {}

  connectGoogle() {
    if (this.authService.isAuthenticated()) {
        this.snackBar.open('You are already authenticated with Google.', 'Close', { duration: 3000 });
        // Potentially, navigate to a page to view/manage sheets or show user info
        return;
    }
    // Redirect to backend OAuth initiation URL
    window.location.href = this.authService.getGoogleAuthUrl();
  }

  // Placeholder for future functionality
  manageGoogleSheets() {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please connect to Google first.', 'Close', { duration: 3000 });
      return;
    }
    this.snackBar.open('Manage Google Sheets - Functionality to be implemented.', 'Close', { duration: 3000 });
    // Navigate to a new component/route for sheet listing and selection
  }
}
