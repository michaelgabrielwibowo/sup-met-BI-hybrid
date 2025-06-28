import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hybrid BI Angular UI';
  isSidenavOpen = true;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
