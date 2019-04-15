import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesPageComponent {}
