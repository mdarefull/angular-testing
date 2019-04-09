import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Company } from 'shared';
import { SharedModule } from 'shared/shared.module';
import { CompaniesListComponent } from './companies-list.component';
import { CompanyComponent } from './company/company.component';

/* What could have been done different?
    - Test the details of the ngFor (trackBy):
        => This is not a functional requirement. Testing it could be overkill.
    - Test the scenario of an empty array.
        => This could be considered as 'unpractical' because of how we not ngFor works.
    - Test style classes membership (h1.text-center)
        => This could be overkill.
*/

@Component({
  template: '<app-companies-list [companies]="companies"></app-companies-list>'
})
class TestHostComponent {
  companies: Company[];
}

describe('CompaniesListComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let debugElement: DebugElement;
  let nativeElement: Element;
  let component: CompaniesListComponent;
  function create(...companies: Partial<Company>[]): Company[] {
    return companies.map(
      c =>
        ({
          country: {},
          name: '',
          ...c
        } as Company)
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TestHostComponent, CompaniesListComponent, CompanyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    debugElement = fixture.debugElement.query(By.directive(CompaniesListComponent));
    nativeElement = debugElement.nativeElement;
    component = debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('render header', () => {
    // Arrange:
    const header = nativeElement.querySelector('h1');

    // Assert:
    expect(header).toBeTruthy();
    expect(header.textContent).toBe('Companies');
  });

  it('render companies', () => {
    // Arrange:
    const companies = create({}, {}, {});
    const companyComponents = debugElement
      .queryAll(By.directive(CompanyComponent))
      .map(d => d.componentInstance as CompanyComponent);

    // Act:
    hostComponent.companies = companies;
    fixture.detectChanges();

    // Assert:
    expect(companyComponents.length).toBe(companies.length);
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const component = companyComponents[i];
      expect(component.company).toBe(company);
    }
  });
});
