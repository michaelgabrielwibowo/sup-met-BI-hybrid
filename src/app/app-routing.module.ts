import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DatasourcesComponent } from './datasources/datasources.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component'; // Import

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'datasources', component: DatasourcesComponent },
  { path: 'workspace', component: WorkspaceComponent },
  { path: 'auth/callback', component: AuthCallbackComponent }, // Add route for callback
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } // Wildcard route for a 404 page later
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
