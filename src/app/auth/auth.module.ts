import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule, 
    RouterModule.forChild([{ path: 'login', component: LoginComponent }])
  ]
})
export class AuthModule { }