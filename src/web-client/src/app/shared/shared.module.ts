import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StockLogoPipe } from './pipes/stock-logo.pipe';

@NgModule({
  declarations: [StockLogoPipe],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    StockLogoPipe,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [HttpClient, CurrencyPipe, StockLogoPipe, DatePipe]
})
export class SharedModule {}
