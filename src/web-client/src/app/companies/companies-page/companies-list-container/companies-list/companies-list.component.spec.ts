import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Company } from 'shared';
import { HostComponentData } from 'shared/test';
import { CompaniesListComponent } from './companies-list.component';

/* What could have been done different?
    - Test the details of the ngFor (trackBy):
        => This is not a functional requirement. Testing it is overkill, just like testing OnPush.
    - Test the scenario of an empty array.
        => This is 'unpractical' because of how ngFor works.
    - Test style classes membership (h1.text-center)
        => This is overkill and generally meaningless
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

describe(CompaniesListComponent.name, () => {
  let testData: HostComponentData<TestHostComponent, CompaniesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesListComponent, TestHostComponent, TestChildComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    testData = new HostComponentData(TestHostComponent, CompaniesListComponent);
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('renders header', () => {
    // Arrange
    const header = testData.queryNative('h1');

    // Assert
    expect(header).toBeTruthy();
    expect(header.textContent).toBe('Companies');
  });

  it('renders companies', () => {
    // Arrange
    const companies = [{}, {}] as Company[];

    // Act
    testData.component.companies = companies;
    testData.detectChanges();
    const companyComponents = testData.queryChildren(TestChildComponent);

    // Assert
    expect(companyComponents.length).toBe(companies.length);
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const component = companyComponents[i];
      expect(component.company).toBe(company);
    }
  });
});
