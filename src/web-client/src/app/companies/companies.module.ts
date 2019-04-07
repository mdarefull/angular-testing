import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { CompaniesPageComponent } from './companies-page/companies-page.component';
import { CompaniesRoutingModule } from './companies-routing.module';

@NgModule({
  declarations: [CompaniesPageComponent],
  imports: [SharedModule, CompaniesRoutingModule, NgxsModule.forFeature([])]
})
export class CompaniesModule {}
