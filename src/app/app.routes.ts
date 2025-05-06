import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },
  { 
    path: 'home',
    loadChildren: () => import('./features/home/home.routes')
      .then(m => m.HOME_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'home' }
];