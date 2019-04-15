import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ComponentData } from 'shared/test';
import { CompaniesPageComponent } from './companies-page.component';

/* What could have been done different?
    - Do not test the renderization of its child component:
      We could argue about the functional value this covers.
      => To create this component, we need to register the selectors it renders.
           Easiert approach is to mock them and test them.
    - Assert the layout of each component:
      * List to the left, form to the right.
      * Amount of columns.
      => This is up to the functional requirements.
           Currently, it is an implementation detail because of bootstrap.
           A different approach could have render this scenario unpractical.
           ! We can always test this by strengthening the selectors. I.e.: Forcing the companies list to be: .row .col-6
*/

@Component({
  template: '',
  selector: 'app-companies-list-container'
})
class TestListComponent {}

@Component({
  template: '',
  selector: 'app-company-form-container'
})
class TestFormComponent {}

describe(CompaniesPageComponent.name, () => {
  let testData: ComponentData<CompaniesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesPageComponent, TestListComponent, TestFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    testData = new ComponentData(CompaniesPageComponent);
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('renders companies list', () => {
    // Assert
    testData.assertHasChild(TestListComponent);
  });

  it('renders company form', () => {
    // Assert
    testData.assertHasChild(TestFormComponent);
  });
});
