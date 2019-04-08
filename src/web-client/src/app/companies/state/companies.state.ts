import { Action, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CompaniesClient, CountriesClient, SwaggerException } from 'shared';
import { AddCompany, GetCompanies, GetCountries } from './actions';
import { CompaniesStateModel, initialCompaniesStateModel } from './companies.model';

@State<CompaniesStateModel>({
  name: 'companies',
  defaults: initialCompaniesStateModel
})
export class CompaniesState {
  constructor(
    private readonly companiesClient: CompaniesClient,
    private readonly countriesClient: CountriesClient
  ) {}

  @Action(GetCompanies)
  getCompanies(ctx: StateContext<CompaniesStateModel>) {
    return this.companiesClient.get().pipe(
      tap(companies => {
        ctx.patchState({
          companies: companies
        });
      })
    );
  }

  @Action(GetCountries)
  getCountries(ctx: StateContext<CompaniesStateModel>) {
    return this.countriesClient.get().pipe(
      tap(countries => {
        ctx.patchState({
          countries: countries
        });
      })
    );
  }

  @Action(AddCompany)
  addCompany(ctx: StateContext<CompaniesStateModel>, action: AddCompany) {
    ctx.patchState({ isAddingCompany: true });

    return this.companiesClient.post(action.newCompany).pipe(
      tap(company => {
        ctx.patchState({
          companies: [...ctx.getState().companies, company],
          isAddingCompany: false,
          addCompanyError: null
        });
      }),
      catchError((ex: SwaggerException) => {
        ctx.patchState({
          isAddingCompany: false,
          addCompanyError: ex.message
        });
        return of(ex);
      })
    );
  }
}
