import { CompaniesStateModel } from './companies.model';
import { CompaniesSelectors } from './companies.selectors';

/* The selector class contains memoized selectors for each important slice of the state.
    The only remarkable selectors to test are those acting as complex queries.
    The rest are included for completion and only because they're too easy to test.
*/

describe(CompaniesSelectors.name, () => {
  it('selects companies sorted by market value', () => {
    // Arrange
    const state = {
      companies: [{ marketValue: 10 }, { marketValue: 5 }, { marketValue: 15 }, { marketValue: 8 }]
    } as CompaniesStateModel;
    const expectedCompanies = [
      state.companies[2],
      state.companies[0],
      state.companies[3],
      state.companies[1]
    ];

    // Act
    const companies = CompaniesSelectors.companies(state);

    // Assert
    expect(companies).toEqual(expectedCompanies);
  });

  it('selects countries sorted by name', () => {
    // Arrange
    const state = {
      countries: [{ name: 'B' }, { name: 'C' }, { name: 'A' }, { name: '1' }]
    } as CompaniesStateModel;
    const expectedCountries = [
      state.countries[3],
      state.countries[2],
      state.countries[0],
      state.countries[1]
    ];

    // Act
    const countries = CompaniesSelectors.countries(state);

    // Assert
    expect(countries).toEqual(expectedCountries);
  });

  it('selects adding company flag', () => {
    // Arrange
    const state = {
      isAddingCompany: true
    } as CompaniesStateModel;

    // Act
    const isAddingCompany = CompaniesSelectors.isAddingCompany(state);

    // Assert
    expect(isAddingCompany).toEqual(state.isAddingCompany);
  });

  it('selects add company error', () => {
    // Arrange
    const state = {
      addCompanyError: 'some error'
    } as CompaniesStateModel;

    // Act
    const addCompanyError = CompaniesSelectors.addCompanyError(state);

    // Assert
    expect(addCompanyError).toEqual(state.addCompanyError);
  });
});
