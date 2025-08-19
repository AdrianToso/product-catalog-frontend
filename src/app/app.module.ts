import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { MaterialModule } from './shared/material.module';

@NgModule({
  declarations: [AppComponent],  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,   
    MaterialModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
