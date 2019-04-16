import { async, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CompaniesClient,
  Company,
  CountriesClient,
  Country,
  NewCompany,
  SwaggerException
} from 'shared';
import { StateData } from 'shared/test';
import { AddCompany, GetCompanies, GetCountries } from './actions';
import { CompaniesStateModel } from './companies.model';
import { CompaniesState } from './companies.state';

/* The only thing that a state should do is to handle actions, hence, we set specifications
    for each action it should handle.
    Usually, specifications here are one of two kinds:
      a) - An action will result in some modification to the state.
      b) - An action will result in the execution of a side effect, which outcomes could result in some further modification of the state.
*/

/* What could have been done different?
    - Use MockBackend to simmulate real api calls:
        => This is overkill. We are using NSwag to generate the client code for us, so it is enough to take it as our endpoint.
        => Testing this should be considered a boundary integration test, and be performed directly over the Client classes to verify integration alone.
*/

describe(CompaniesState.name, () => {
  let countriesSpy: jasmine.SpyObj<CountriesClient>;
  let companiesSpy: jasmine.SpyObj<CompaniesClient>;
  let stateData: StateData<CompaniesStateModel>;

  beforeEach(() => {
    countriesSpy = jasmine.createSpyObj<CountriesClient>(['get']);
    companiesSpy = jasmine.createSpyObj<CompaniesClient>(['get', 'post']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CompaniesState])],
      providers: [
        { provide: CountriesClient, useValue: countriesSpy },
        { provide: CompaniesClient, useValue: companiesSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    stateData = new StateData<CompaniesStateModel>(CompaniesState.stateName);
  });

  it('on GetCountries, requests countries from api', () => {
    // Arrange
    countriesSpy.get.and.returnValue(of());

    // Act
    stateData.dispatch(new GetCountries());

    // Assert
    expect(countriesSpy.get).toHaveBeenCalledTimes(1);
  });

  it('stores api countries in state', () => {
    // Arrange
    const expectedCountries = [{}, {}, {}] as Country[];
    countriesSpy.get.and.returnValue(of(expectedCountries));

    // Act
    stateData.dispatch(new GetCountries());

    // Assert
    expect(stateData.state.countries).toBe(expectedCountries);
  });

  it('on GetCompanies, requests companies from api', () => {
    // Arrange
    companiesSpy.get.and.returnValue(of());

    // Act
    stateData.dispatch(new GetCompanies());

    // Assert
    expect(companiesSpy.get).toHaveBeenCalledTimes(1);
  });

  it('stores api companies in state', () => {
    // Arrange
    const expectedCompanies = [{}, {}, {}] as Company[];
    companiesSpy.get.and.returnValue(of(expectedCompanies));

    // Act
    stateData.dispatch(new GetCompanies());

    // Assert
    expect(stateData.state.companies).toBe(expectedCompanies);
  });

  it('on AddCompany, post company to api', () => {
    // Arrange
    companiesSpy.post.and.returnValue(of());
    const expectedCompany = {} as NewCompany;

    // Act
    stateData.dispatch(new AddCompany(expectedCompany));

    // Assert
    expect(companiesSpy.post).toHaveBeenCalledTimes(1);
    expect(companiesSpy.post).toHaveBeenCalledWith(expectedCompany);
  });

  it('on AddCompany, set isAddingCompany flag while waiting for request', () => {
    // Arrange
    companiesSpy.post.and.returnValue(of(undefined).pipe(delay(1)));

    // Act
    stateData.dispatch(new AddCompany(undefined));

    // Assert
    expect(stateData.state.isAddingCompany).toBeTruthy();
  });

  it('on AddCompany, if api succees, adds company to state, unsets adding flag and error', () => {
    // Arrange
    let expectedCompanies = [{}, {}, {}] as Company[];
    const model = {
      companies: expectedCompanies
    } as CompaniesStateModel;
    stateData.setState(model);

    const expectedCompany = {} as Company;
    companiesSpy.post.and.returnValue(of(expectedCompany));
    expectedCompanies = [...expectedCompanies, expectedCompany];

    // Act
    stateData.dispatch(new AddCompany(undefined));

    // Assert
    expect(stateData.state.companies).toEqual(expectedCompanies);
    expect(stateData.state.isAddingCompany).toBeFalsy();
    expect(stateData.state.addCompanyError).toBeFalsy();
  });

  it('on AddCompany, if api fails, store error message and unsets adding flag', () => {
    // Arrange
    const expectedMessage = 'some error message';
    companiesSpy.post.and.returnValue(
      throwError(new SwaggerException(expectedMessage, undefined, undefined, undefined, undefined))
    );

    // Act
    stateData.dispatch(new AddCompany(undefined));

    // Assert
    expect(stateData.state.addCompanyError).toBe(expectedMessage);
    expect(stateData.state.isAddingCompany).toBeFalsy();
  });
});
