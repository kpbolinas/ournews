import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MainComponent } from './main/main.component';
import { GuestComponent } from './guest/guest.component';
import { PageNotFoundComponent } from 'src/app/features/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from 'src/app/features/unauthorized/unauthorized.component';
import { AuthGuardService as AuthGuard } from 'src/app/auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'forgot-password',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
      },
      {
        path: 'verification',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/verification/verification.module').then(m => m.VerificationModule)
      }
    ]
  },
  { path: '',
    component: MainComponent,
    children: [
      {
        path: 'unpublished',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/unpublished/unpublished.module').then(m => m.UnpublishedModule)
      },
      {
        path: 'published',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/published/published.module').then(m => m.PublishedModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'logout',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/features/logout/logout.module').then(m => m.LogoutModule)
      }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutRoutingModule {}
