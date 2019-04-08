import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { CompaniesListContainerComponent } from './companies-page/companies-list-container/companies-list-container.component';
import { CompaniesListComponent } from './companies-page/companies-list-container/companies-list/companies-list.component';
import { CompanyComponent } from './companies-page/companies-list-container/companies-list/company/company.component';
import { CompaniesPageComponent } from './companies-page/companies-page.component';
import { CompanyFormContainerComponent } from './companies-page/company-form-container/company-form-container.component';
import { CompanyFormComponent } from './companies-page/company-form-container/company-form/company-form.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesState } from './state/companies.state';

@NgModule({
  declarations: [
    CompaniesPageComponent,
    CompaniesListContainerComponent,
    CompaniesListComponent,
    CompanyComponent,
    CompanyFormContainerComponent,
    CompanyFormComponent
  ],
  imports: [SharedModule, CompaniesRoutingModule, NgxsModule.forFeature([CompaniesState])]
})
export class CompaniesModule {}
