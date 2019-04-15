import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { GetCompanies } from 'companies/state';
import { CompaniesStateModel } from 'companies/state/companies.model';
import { CompaniesState } from 'companies/state/companies.state';
import { Company } from 'shared';
import { ComponentData, StoreData } from 'shared/test';
import { CompaniesListContainerComponent } from './companies-list-container.component';

/* What could have been done different?
    - Mock CompanyState instead than integrating it.
        => This is overkill.
             By mocking 'dispatch' on the Store we ensure no side-effect would be executed.
             This way it's easier to test state slice selection.
       *** Main inconvenience is that we new to provide the state dependencies. Usually, HttpClientModule
*/

@Component({
  template: '',
  selector: 'app-companies-list'
})
class TestChildComponent {
  @Input() companies: Company[];
}

describe(CompaniesListContainerComponent.name, () => {
  let storeTestData: StoreData<CompaniesStateModel>;
  let testData: ComponentData<CompaniesListContainerComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, NgxsModule.forRoot([CompaniesState])],
      declarations: [CompaniesListContainerComponent, TestChildComponent]
    }).compileComponents();
  }));

  // This one must be called after the Test Module creation and before the component initialization.
  beforeEach(() => {
    storeTestData = new StoreData<CompaniesStateModel>(CompaniesState.stateName);
  });

  beforeEach(() => {
    testData = new ComponentData(CompaniesListContainerComponent);
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('dispatches GetCompanies onInit', () => {
    // Assert
    storeTestData.assertActionsDispatched(new GetCompanies());
  });

  it('renders companies list', () => {
    // Assert
    testData.assertHasChild(TestChildComponent);
  });

  it('selects companies', () => {
    // Arrange
    const child = testData.queryChild(TestChildComponent);
    const model = {
      companies: [{}, {}] as Company[]
    } as CompaniesStateModel;

    // Act
    storeTestData.setState(model);
    testData.detectChanges();

    // Assert
    expect(child.companies).toEqual(model.companies);
  });
});
