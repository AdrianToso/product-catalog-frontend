import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
