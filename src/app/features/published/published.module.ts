import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PublishedRoutingModule } from './published-routing.module';
import { PublishedComponent } from './published.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    PublishedRoutingModule
  ],
  declarations: [PublishedComponent]
})

export class PublishedModule {}
