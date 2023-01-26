import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ProfileRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProfileComponent]
})

export class ProfileModule {}
