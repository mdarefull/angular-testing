import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Company } from 'shared';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyComponent {
  @Input() company: Company;

  get id() {
    return this.company.id;
  }

  get stockClass() {
    return `color-${this.company.stockLogoColor}`;
  }

  get name() {
    return this.company.name;
  }

  get email() {
    return this.company.email;
  }

  get country() {
    return this.company.country.name;
  }

  get marketValue() {
    return this.company.marketValue;
  }

  get creationDate() {
    return this.company.creationDate;
  }
}
