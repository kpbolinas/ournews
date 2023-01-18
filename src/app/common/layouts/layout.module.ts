import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { GuestComponent } from './guest/guest.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  imports: [
    LayoutRoutingModule
  ],
  exports: [],
  declarations: [
    MainComponent,
    GuestComponent
  ]
})

export class LayoutModule {}
