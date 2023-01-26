import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { GuestComponent } from './guest/guest.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  imports: [
    LayoutRoutingModule
  ],
  exports: [],
  declarations: [
    MainComponent,
    GuestComponent,
    SidebarComponent,
    HeaderComponent
  ]
})

export class LayoutModule {}
