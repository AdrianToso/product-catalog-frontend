import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../shared/material.module';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule {}
