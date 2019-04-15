import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Company } from 'shared';
import { CompaniesSelectors, GetCompanies } from '../../state';

@Component({
  selector: 'app-companies-list-container',
  templateUrl: './companies-list-container.component.html',
  styleUrls: ['./companies-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesListContainerComponent implements OnInit {
  @Select(CompaniesSelectors.companies) readonly companies$: Observable<Company[]>;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetCompanies());
  }
}
