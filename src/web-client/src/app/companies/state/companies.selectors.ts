import { Selector } from '@ngxs/store';
import { CompaniesStateModel } from './companies.model';
import { CompaniesState } from './companies.state';

export class CompaniesSelectors extends CompaniesState {
  @Selector()
  static companies(state: CompaniesStateModel) {
    return [...state.companies].sort((a, b) => b.marketValue - a.marketValue);
  }

  @Selector()
  static countries(state: CompaniesStateModel) {
    return [...state.countries].sort((a, b) => a.name.localeCompare(b.name));
  }

  @Selector()
  static isAddingCompany(state: CompaniesStateModel) {
    return state.isAddingCompany;
  }

  @Selector()
  static addCompanyError(state: CompaniesStateModel) {
    return state.addCompanyError;
  }
}
