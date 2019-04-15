import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { GetCountries, AddCompany, GetCompanies } from 'companies/state';
import { CompaniesStateModel } from 'companies/state/companies.model';
import { CompaniesState } from 'companies/state/companies.state';
import { Country, NewCompany } from 'shared';
import { ComponentData, StoreData } from 'shared/test';
import { CompanyFormContainerComponent } from './company-form-container.component';
import { debug } from 'util';

/* What could have been done different?
    - Mock store select:
      * Because we didn't mock the store select, we integrate the component with the actual select.
         Because of this, our test is coupled to the select implementation.
         Specificaly to how the select sorts the countries, forcing us to specify a name.
        => Mocking the whole Store.select mechanism to avoid this is overkill and unpractical.
*/

// We use a Test Child Component to isolate the SUT from the components it render while
// testing its communications.
@Component({
  template: '',
  selector: 'app-company-form'
})
class TestChildComponent {
  @Input() countries: Country[];
  @Input() isAddingCompany: boolean;
  @Input() addCompanyError: string;

  @Output() readonly addNewCompany = new EventEmitter<NewCompany>();
}

class CompanyFormContainerComponentData extends ComponentData<CompanyFormContainerComponent> {
  get childComponent() {
    return this.queryChild(TestChildComponent);
  }
}

describe(CompanyFormContainerComponent.name, () => {
  let storeTestData: StoreData<CompaniesStateModel>;
  let testData: CompanyFormContainerComponentData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, NgxsModule.forRoot([CompaniesState])],
      declarations: [CompanyFormContainerComponent, TestChildComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    // This one must be called after the Test Module creation and before the component initialization.
    storeTestData = new StoreData<CompaniesStateModel>(CompaniesState.stateName);
    testData = new CompanyFormContainerComponentData(CompanyFormContainerComponent);
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('dispatches GetCountries on init', () => {
    // Assert
    storeTestData.assertActionsDispatched(new GetCountries());
  });

  it('renders company form', () => {
    // Assert
    testData.assertHasChild(TestChildComponent);
  });

  it('selects countries', () => {
    // Arrange
    const child = testData.childComponent;
    const model = {
      countries: [{ name: '' }, { name: '' }] as Country[]
    } as CompaniesStateModel;

    // Act
    storeTestData.setState(model);
    testData.detectChanges();

    // Assert
    expect(child.countries).toEqual(model.countries);
  });

  it('selects is adding company flag', () => {
    // Arrange
    const child = testData.childComponent;
    const model = {
      isAddingCompany: true
    } as CompaniesStateModel;

    // Act
    storeTestData.setState(model);
    testData.detectChanges();

    // Assert
    expect(child.isAddingCompany).toBe(model.isAddingCompany);
  });

  it('selects add company error', () => {
    // Arrange
    const child = testData.childComponent;
    const model = {
      addCompanyError: 'some error'
    } as CompaniesStateModel;

    // Act
    storeTestData.setState(model);
    testData.detectChanges();

    // Assert
    expect(child.addCompanyError).toBe(model.addCompanyError);
  });

  it('dispatches AddCompany on addNewCompany event', () => {
    // Arrange
    const child = testData.childComponent;
    const newCompany = {} as NewCompany;
    const expectedAction = new AddCompany(newCompany);

    storeTestData.dispatchSpy.calls.reset();

    // Act
    child.addNewCompany.emit(newCompany);

    // Assert
    storeTestData.assertActionsDispatched(expectedAction);
  });
});
