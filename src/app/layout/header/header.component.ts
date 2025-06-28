import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Corrected path
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('You have been logged out from Google.', 'Close', { duration: 3000 });
    this.router.navigate(['/home']); // Or to a login page if you have one for the app itself
  }
}
