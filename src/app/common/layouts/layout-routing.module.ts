import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { GuestComponent } from './guest/guest.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '',
    component: GuestComponent,
    children: [
      { path: 'login', loadChildren: () => import('src/app/features/login/login.module').then(m => m.LoginModule) },
      { path: 'forgot-password', loadChildren: () => import('src/app/features/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
      { path: 'verification', loadChildren: () => import('src/app/features/verification/verification.module').then(m => m.VerificationModule) },
      { path: '**', loadChildren: () => import('src/app/features/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutRoutingModule {}
