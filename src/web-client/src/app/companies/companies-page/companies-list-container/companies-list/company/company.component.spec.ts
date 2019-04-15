import { CurrencyPipe, DatePipe } from '@angular/common';
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

class CompanyComponentData extends HostComponentData<TestHostComponent, CompanyComponent> {
  readonly defaultCompany = {
    name: '',
    country: {}
  } as Company;

  get stockLogo() {
    return this.queryNative('.mat-card-avatar');
  }

  get nameText() {
    return this.queryNative('mat-card-title');
  }

  get marketValueText() {
    return this.queryNative('mat-card-subtitle');
  }

  get cardContentTexts() {
    return this.queryAllNative('mat-card-content p');
  }

  get countryText() {
    return this.cardContentTexts[0];
  }

  get emailText() {
    return this.component.company.email ? this.cardContentTexts[1] : undefined;
  }

  get creationDateText() {
    const hasEmail = this.component.company.email;
    return this.cardContentTexts[hasEmail ? 2 : 1];
  }

  constructor() {
    super(TestHostComponent, CompanyComponent, false);

    this.component.company = this.defaultCompany;
    this.detectChanges();
  }

  createCompany(company: Partial<Company>): Company {
    return { ...this.defaultCompany, ...company };
  }
}

describe(CompanyComponent.name, () => {
  let testData: CompanyComponentData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [TestHostComponent, CompanyComponent, StockLogoPipe],
      providers: [StockLogoPipe, DatePipe, CurrencyPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    testData = new CompanyComponentData();
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('renders stock logo', () => {
    // Arrange
    const company = testData.createCompany({ name: 'Some Name', stockLogoColor: 2 });
    const pipe = testData.getDependency(StockLogoPipe);
    const expectedText = pipe.transform(company.name);
    const expectedClass = `color-${company.stockLogoColor}`;
    const stockLogo = testData.stockLogo;

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
    const company = testData.createCompany({ name: 'Company Name' });
    const name = testData.nameText;

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(name).toBeTruthy();
    expect(name.textContent).toBe(company.name);
  });

  it('renders market value', () => {
    // Arrange
    const company = testData.createCompany({ marketValue: 123456.78 });
    const pipe = testData.getDependency(CurrencyPipe) as CurrencyPipe;
    const expectedText = pipe.transform(company.marketValue);
    const marketValue = testData.marketValueText;

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(marketValue).toBeTruthy();
    expect(marketValue.textContent).toBe(expectedText);
  });

  it('renders country', () => {
    // Arrange
    const company = testData.createCompany({ country: { name: 'United Stated' } as Country });
    const country = testData.countryText;

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(country).toBeTruthy();
    expect(country.textContent).toBe(`Country: ${company.country.name}`);
  });

  it('renders email', () => {
    // Arrange
    const company = testData.createCompany({ email: 'test@example.com' });

    // Act
    testData.component.company = company;
    testData.detectChanges();
    const email = testData.emailText;

    // Assert
    expect(email).toBeTruthy();
    expect(email.textContent).toBe(`Email: ${company.email}`);
  });

  it('does not render falsy email', () => {
    // Arrange
    const company = testData.createCompany({ email: undefined });

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(testData.cardContentTexts.length).toBe(2);
  });

  it('renders creation date', () => {
    // Arrange
    const company = testData.createCompany({
      creationDate: new Date(2019, 12, 31, 12, 38, 33, 128)
    });
    const pipe = testData.getDependency(DatePipe);
    const expectedDate = pipe.transform(company.creationDate, 'long');
    const creationDate = testData.creationDateText;

    // Act
    testData.component.company = company;
    testData.detectChanges();

    // Assert
    expect(creationDate).toBeTruthy();
    expect(creationDate.textContent).toBe(`Creation Date: ${expectedDate}`);
  });
});
