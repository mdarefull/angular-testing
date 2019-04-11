import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Company } from 'shared';
import { CompaniesListComponent } from './companies-list.component';

/* What could have been done different?
    - Test the details of the ngFor (trackBy):
        => This is not a functional requirement. Testing it could be overkill.
    - Test the scenario of an empty array.
        => This could be considered as 'unpractical' because of how we not ngFor works.
    - Test style classes membership (h1.text-center)
        => This could be overkill.
    - Isolate test child even better:
        => We have 3 options here:
              a. use the actual component (CompanyComponent): Restrict our test and could create exceptions due to template bindings, logic, etc.
              b. use a component that extends the actual component, set an empty template and override conflicting methods.
              c. use a completely empty component with just the required signature.
        => We chose c.) becuase we set exactly what we want to test and it sholdn't break unlees the functionality changes.
*/

@Component({
  template: '<app-companies-list [companies]="companies"></app-companies-list>'
})
class TestHostComponent {
  companies: Company[];
}

// We use a Test Child Component to isolate the SUT from the components it render while
// testing its communications.
@Component({
  template: '',
  selector: 'app-company'
})
class TestChildComponent {
  @Input() company: Company;
}

describe('CompaniesListComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let debugElement: DebugElement;
  let nativeElement: Element;
  let component: CompaniesListComponent;
  function create(...companies: Partial<Company>[]): Company[] {
    return companies.map(c => c as Company);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesListComponent, TestHostComponent, TestChildComponent]
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

    // Act:
    hostComponent.companies = companies;
    fixture.detectChanges();
    const companyComponents = debugElement
      .queryAll(By.directive(TestChildComponent))
      .map(d => d.componentInstance as TestChildComponent);

    // Assert:
    expect(companyComponents.length).toBe(companies.length);
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const component = companyComponents[i];
      expect(component.company).toBe(company);
    }
  });
});
