import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile/profile.component';
import { ActivityListComponent } from './features/activities/activity-list/activity-list.component';
import { ActivityDetailComponent } from './features/activities/activity-detail/activity-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'activities', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },
  { 
    path: 'home',
    redirectTo: 'activities',
    pathMatch: 'full'
  },
  {
    path: 'activities',
    component: ActivityListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'activities/:id',
    component: ActivityDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'activities' }
];