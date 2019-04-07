import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniesClient, Company } from 'shared';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesPageComponent implements OnInit {
  companies$: Observable<Company[]>;

  constructor(private readonly client: CompaniesClient) {}

  ngOnInit() {
    this.companies$ = this.client.getAll();
  }

  companyTrackerFn(_: number, item: Company): number {
    return item.id;
  }
}
