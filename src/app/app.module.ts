import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';


// Core and Shared Modules (to be created)
// import { CoreModule } from './core/core.module'; // AuthService is in core/services now
// import { SharedModule } from './shared/shared.module';

// Page Components
import { HomeComponent } from './home/home.component';
import { DatasourcesComponent } from './datasources/datasources.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component'; // Import

// Layout Components
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';

// Services - AuthService is provided in root


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DatasourcesComponent,
    WorkspaceComponent,
    HeaderComponent,
    SidenavComponent,
    AuthCallbackComponent // Declare
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // Add HttpClientModule
    RouterModule,
    AppRoutingModule,
    // CoreModule,
    // SharedModule,

    // Angular Material
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [
    // AuthService is provided in root, no need to list here unless overriding
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
