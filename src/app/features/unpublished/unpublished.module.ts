import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UnpublishedRoutingModule } from './unpublished-routing.module';
import { UnpublishedComponent } from './unpublished.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    UnpublishedRoutingModule
  ],
  declarations: [UnpublishedComponent]
})

export class UnpublishedModule {}
