import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Company, Country } from 'shared';
import { StockLogoPipe } from 'shared/pipes/stock-logo.pipe';
import { SharedModule } from 'shared/shared.module';
import { CompanyComponent } from './company.component';

/* What could have been done different?
    - Create a central input value with all the data:
        => This reduces the isolation of a test, making it harder to maintain.
    - Not tying to angular material components:
        => We are using angular material so there are some strict rules to follow.
             Selecting elements by its type (<mat-card-title>) directly it's the most practical approach.
    - Tested the template layout better:
        * it renders a <mat-card>
        * better select each element: mat-card-title is the second child inside mat-card-header
        => These are not strictly functional specifications and testing it would tight the tests more to the implementation.
             The app would have been more robust but more rigid too (harder to refactor).
    - Unit tests with pipes involved:
        => Whenever we use a pipe, there's no way to create the purest unit test. This is the most practical approach.
*/

@Component({
  template: '<app-company [company]="company"></app-company>'
})
class TestHostComponent {
  company: Company;
}

describe('CompanyComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let debugElement: DebugElement;
  let nativeElement: Element;
  let component: CompanyComponent;
  const defaultCompany = {
    name: '',
    country: {}
  } as Company;
  function create(company: Partial<Company>): Company {
    return { ...defaultCompany, ...company };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TestHostComponent, CompanyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    debugElement = fixture.debugElement.query(By.directive(CompanyComponent));
    nativeElement = debugElement.nativeElement;
    component = debugElement.componentInstance;

    hostComponent.company = defaultCompany;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders stock logo', () => {
    // Arrange:
    const company = create({ name: 'Some Name', stockLogoColor: 2 });
    const pipe = TestBed.get(StockLogoPipe) as StockLogoPipe;
    const expectedValue = pipe.transform(company.name);
    const expectedClass = `color-${company.stockLogoColor}`;
    const stockLogo = nativeElement.querySelector('.mat-card-avatar');

    // Act:
    hostComponent.company = company;
    fixture.detectChanges();

    // Assert:
    expect(stockLogo).toBeTruthy();
    expect(stockLogo.textContent).toBe(expectedValue);
    expect(stockLogo.classList).toContain(expectedClass);
  });

  it('renders name', () => {
    // Arrange:
    const company = create({ name: 'Company Name' });
    const name = nativeElement.querySelector('mat-card-title');

    // Act:
    hostComponent.company = company;
    fixture.detectChanges();

    // Assert:
    expect(name).toBeTruthy();
    expect(name.textContent).toBe(company.name);
  });

  it('renders market value', () => {
    // Arrange:
    const company = create({ marketValue: 123456.78 });
    const pipe = TestBed.get(CurrencyPipe) as CurrencyPipe;
    const expectedValue = pipe.transform(company.marketValue);
    const marketValue = nativeElement.querySelector('mat-card-subtitle');

    // Act:
    hostComponent.company = company;
    fixture.detectChanges();

    // Assert:
    expect(marketValue).toBeTruthy();
    expect(marketValue.textContent).toBe(expectedValue);
  });

  it('renders country', () => {
    // Arrange:
    const company = create({ country: { name: 'United Stated' } as Country });
    const country = nativeElement.querySelectorAll('mat-card-content p')[0];

    // Act:
    hostComponent.company = company;
    fixture.detectChanges();

    // Assert:
    expect(country).toBeTruthy();
    expect(country.textContent).toBe(`Country: ${company.country.name}`);
  });

  it('renders email', () => {
    // Arrange:
    const company = create({ email: 'test@example.com' });

    // Act
    hostComponent.company = company;
    fixture.detectChanges();
    const email = nativeElement.querySelectorAll('mat-card-content p')[1];

    // Assert:
    expect(email).toBeTruthy();
    expect(email.textContent).toBe(`Email: ${company.email}`);
  });

  it('does not render falsy email', () => {
    // Arrange
    const company = create({ email: undefined });

    // Act
    hostComponent.company = company;
    fixture.detectChanges();
    const contents = nativeElement.querySelectorAll('mat-card-content p');

    // Assert;
    expect(contents.length).toBe(2);
  });

  it('renders creation date', () => {
    // Arrange:
    const company = create({ creationDate: new Date(2019, 12, 31, 12, 38, 33, 128) });
    const pipe = TestBed.get(DatePipe) as DatePipe;
    const expectedDate = pipe.transform(company.creationDate, 'long');
    const creationDate = nativeElement.querySelectorAll('mat-card-content p')[1];

    // Act:
    hostComponent.company = company;
    fixture.detectChanges();

    // Assert:
    expect(creationDate).toBeTruthy();
    expect(creationDate.textContent).toBe(`Creation Date: ${expectedDate}`);
  });
});
