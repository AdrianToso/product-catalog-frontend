import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { 
    path: 'create', 
    component: ProductFormComponent, 
    canActivate: [RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  { 
    path: 'edit/:id', 
    component: ProductFormComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'Admin' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }