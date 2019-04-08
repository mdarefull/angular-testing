import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Company } from 'shared';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesListComponent {
  @Input() companies: Company[];

  companyTrackerFn(_: number, item: Company): number {
    return item.id;
  }
}
