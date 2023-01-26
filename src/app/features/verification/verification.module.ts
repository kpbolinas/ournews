import { NgModule } from '@angular/core';
import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    VerificationRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VerificationComponent]
})

export class VerificationModule {}
