import { CompaniesModule } from 'companies/companies.module';
import { CompaniesStateModel, initialCompaniesStateModel } from './companies.model';

/* The only possible value on testing the model is that its initial value
      could change overtime and break the app.
    Testing it could be overkill and should be evaluated for each use-case.
    It is included only for references purposes.
*/
describe(CompaniesModule.name, () => {
  it('has expected initial state', () => {
    // Arrange
    const expectedInitialState: CompaniesStateModel = {
      companies: [],
      countries: [],
      isAddingCompany: undefined,
      addCompanyError: undefined
    };

    // Assert
    expect(initialCompaniesStateModel).toEqual(expectedInitialState);
  });
});
