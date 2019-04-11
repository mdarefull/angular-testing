import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Company } from 'shared';
import { CompaniesSelectors, GetCompanies } from '../../state';
import { CompaniesStateModel } from 'companies/state/companies.model';

@Component({
  selector: 'app-companies-list-container',
  templateUrl: './companies-list-container.component.html',
  styleUrls: ['./companies-list-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesListContainerComponent implements OnInit {
  @Select((state: CompaniesStateModel) => state.companies) readonly companies$: Observable<Company[]>;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetCompanies());
  }
}
