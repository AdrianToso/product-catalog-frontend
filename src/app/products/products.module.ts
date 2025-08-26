import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { PurchaseDialogComponent } from './purchase-dialog/purchase-dialog.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
];

@NgModule({
  declarations: [
    ProductListComponent,
    ConfirmDialogComponent,
    ProductFormDialogComponent,
    PurchaseDialogComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [ProductListComponent],
})
export class ProductsModule {}