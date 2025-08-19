import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
];

@NgModule({
  declarations: [
    ProductListComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,          // <- Toolbar, Card, Paginator, Dialog, etc.
    RouterModule.forChild(routes),
  ],
  exports: [ProductListComponent],
})
export class ProductsModule {}
