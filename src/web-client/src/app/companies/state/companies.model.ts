import { Company, Country } from 'shared';

export interface CompaniesStateModel {
  companies: Company[];
  countries: Country[];
  isAddingCompany: boolean;
  addCompanyError: string;
}

export const initialCompaniesStateModel: CompaniesStateModel = {
  companies: [],
  countries: [],
  isAddingCompany: undefined,
  addCompanyError: undefined
};
