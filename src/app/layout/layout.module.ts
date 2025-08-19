import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule as CdkLayoutModule } from '@angular/cdk/layout'; 

import { LayoutComponent } from './layout.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, MaterialModule, CdkLayoutModule ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
