import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Company, Country } from 'shared';
import { StockLogoPipe } from 'shared/pipes/stock-logo.pipe';
import { HostComponentData } from 'shared/test';
import { CompanyComponent } from './company.component';

/* What could have been done different?
    - Create a unique @Input() parameter with all the data:
        => This reduces the isolation of a test, making each harder to maintain.
    - Not tying to angular material components:
        => We are using angular material so there are some strict rules to follow.
             Selecting elements by its type (<mat-card-title>) directly it's the most practical approach.
    - Test the template layout better:
        * it renders a <mat-card>
        * better select each element: mat-card-title is the second child inside mat-card-header
        => These are not strictly functional specifications and testing it would tight the tests more to the implementation.
             The app would have been more robust but more rigid too (harder to refactor).
    - Unit tests with pipes involved:
        => Whenever we use a pipe, there's no way to create the purest unit test. This is the most practical approach.
*/

// We use a Test Host Component to properly test angular features (@Input/@Output, etc...)
@Component({
  template: '<app-company [company]="company"></app-company>'
})
class TestHostComponent {
  company: Company;
}

const defaultCompany = {
  name: '',
  country: {}
} as Company;
function create(company: Partial<Company>): Company {
  return { ...defaultCompany, ...company };
}

describe(CompanyComponent.name, () => {
  let testData: HostComponentData<TestHostComponent, CompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [TestHostComponent, CompanyComponent, StockLogoPipe],
      providers: [StockLogoPipe, DatePipe, CurrencyPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    testData = new HostComponentData(TestHostComponent, CompanyComponent, false);
    testData.component.company = defaultCompany;
    testData.detectChanges();
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('renders stock logo', () => {
    // Arrange
    const company = create({ name: 'Some Name', stockLogoColor: 2 });
    const pipe = TestBed.get(StockLogoPipe) as StockLogoPipe;
    const expectedText = pipe.transform(company.name);
    const expectedClass = `color-${company.stockLogoColor}`;
    const stockLogo = testData.nativeElement.querySelector('.mat-card-avatar');

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert:
    expect(stockLogo).toBeTruthy();
    expect(stockLogo.textContent).toBe(expectedText);
    expect(stockLogo.classList).toContain(expectedClass);
  });

  it('renders name', () => {
    // Arrange
    const company = create({ name: 'Company Name' });
    const name = testData.nativeElement.querySelector('mat-card-title');

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(name).toBeTruthy();
    expect(name.textContent).toBe(company.name);
  });

  it('renders market value', () => {
    // Arrange
    const company = create({ marketValue: 123456.78 });
    const pipe = TestBed.get(CurrencyPipe) as CurrencyPipe;
    const expectedText = pipe.transform(company.marketValue);
    const marketValue = testData.nativeElement.querySelector('mat-card-subtitle');

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(marketValue).toBeTruthy();
    expect(marketValue.textContent).toBe(expectedText);
  });

  it('renders country', () => {
    // Arrange
    const company = create({ country: { name: 'United Stated' } as Country });
    const country = testData.nativeElement.querySelectorAll('mat-card-content p')[0];

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(country).toBeTruthy();
    expect(country.textContent).toBe(`Country: ${company.country.name}`);
  });

  it('renders email', () => {
    // Arrange
    const company = create({ email: 'test@example.com' });

    // Act
    testData.component.company = company;
    testData.detectChanges();
    const email = testData.nativeElement.querySelectorAll('mat-card-content p')[1];

    // Assert
    expect(email).toBeTruthy();
    expect(email.textContent).toBe(`Email: ${company.email}`);
  });

  it('does not render falsy email', () => {
    // Arrange
    const company = create({ email: undefined });

    // Act
    testData.component.company = company;
    testData.detectChanges();
    const contents = testData.nativeElement.querySelectorAll('mat-card-content p');

    // Assert
    expect(contents.length).toBe(2);
  });

  it('renders creation date', () => {
    // Arrange
    const company = create({ creationDate: new Date(2019, 12, 31, 12, 38, 33, 128) });
    const pipe = TestBed.get(DatePipe) as DatePipe;
    const expectedDate = pipe.transform(company.creationDate, 'long');
    const creationDate = testData.nativeElement.querySelectorAll('mat-card-content p')[1];

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(creationDate).toBeTruthy();
    expect(creationDate.textContent).toBe(`Creation Date: ${expectedDate}`);
  });
});
