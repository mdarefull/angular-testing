import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  exports: [CommonModule, ReactiveFormsModule],
  providers: [HttpClient]
})
export class SharedModule {}
