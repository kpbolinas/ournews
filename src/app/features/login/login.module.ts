import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    LoginRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})

export class LoginModule {}
