import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Country, NewCompany } from 'shared';
import { AddCompany, CompaniesSelectors, GetCountries } from '../../state';

@Component({
  selector: 'app-company-form-container',
  templateUrl: './company-form-container.component.html',
  styleUrls: ['./company-form-container.component.scss']
})
export class CompanyFormContainerComponent implements OnInit {
  @Select(CompaniesSelectors.countries) readonly countries$: Observable<Country[]>;
  @Select(CompaniesSelectors.isAddingCompany) readonly isAddingCompany$: Observable<boolean>;
  @Select(CompaniesSelectors.addCompanyError) readonly addCompanyError$: Observable<string>;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetCountries());
  }

  onAddNewCompany(newCompany: NewCompany) {
    this.store.dispatch(new AddCompany(newCompany));
  }
}
