import { NgModule } from '@angular/core';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ForgotPasswordRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ForgotPasswordComponent]
})

export class ForgotPasswordModule {}
