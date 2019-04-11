import { Component, DebugElement, Input, Type } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  flushMicrotasks
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { CompaniesStateModel } from 'companies/state/companies.model';
import { CompaniesState } from 'companies/state/companies.state';
import { Company } from 'shared';
import { SharedModule } from 'shared/shared.module';
import { CompaniesListContainerComponent } from './companies-list-container.component';

// #region Helpers candidates:
interface ComponentTestData<T> {
  fixture: ComponentFixture<T>;
  debugElement: DebugElement;
  nativeElement: Element;
  component: T;
}

function initializeComponent<T>(componentType: Type<T>): ComponentTestData<T> {
  const fixture = TestBed.createComponent(componentType);
  const component = fixture.componentInstance;
  const debugElement = fixture.debugElement;
  const nativeElement = fixture.nativeElement;

  fixture.detectChanges();

  return {
    component: component,
    debugElement: debugElement,
    fixture: fixture,
    nativeElement: nativeElement
  };
}
// #endregion Helpers candidates

@Component({
  template: '',
  selector: 'app-companies-list'
})
class TestChildComponent {
  @Input() companies: Company[];
}

fdescribe('CompaniesListContainerComponent', () => {
  let store: Store;
  // const stateSpy = jasmine.createSpyObj<CompaniesState>(['getCompanies']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, NgxsModule.forRoot([CompaniesState])],
      declarations: [CompaniesListContainerComponent, TestChildComponent]
      // providers: [{ provide: CompaniesState, useValue: stateSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store) as Store;
    spyOn(store, 'dispatch');
  });

  // it('should create', () => {
  //   // Arrange:
  //   const testData = initializeComponent(CompaniesListContainerComponent);

  //   // Assert:
  //   expect(testData.component).toBeTruthy();
  // });

  // it('should dispatch GetCompanies onInit', () => {
  //   // Act:
  //   initializeComponent(CompaniesListContainerComponent);

  //   // Assert
  //   expect(stateSpy.getCompanies).toHaveBeenCalledTimes(1);
  // });

  it('should select companies', () => {
    // Arrange
    const testData = initializeComponent(CompaniesListContainerComponent);
    const testChild = testData.debugElement.query(By.directive(TestChildComponent))
      .componentInstance as TestChildComponent;

    store = TestBed.get(Store);
    const state = {
      companies: [{} as Company, {} as Company]
    } as CompaniesStateModel;

    // Act
    store.reset(state);
    testData.fixture.detectChanges();
    debugger;

    // Assert
    expect(testChild.companies).toBe(state.companies);
  });
});
